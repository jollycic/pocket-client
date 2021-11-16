///<reference path="./types.d.ts" />

import { IncomingMessage } from 'http'
import { request } from 'https'

export class PocketClient implements PocketAPI {
    /** Creates a new [Pocket](https://getpocket.com) API client */
    constructor ({ consumer_key, token, logger } : PocketAPIConfig) {

        this.consumer_key = consumer_key
        
        if (token) {
            this.access_token = token.access_token
            this.username = token.username
        }

        this.logger = logger ?? console

        this.applicationRates = {
            limit: undefined,
            remaining: undefined,
            secondsToReset: undefined
        }
    }

    get host () { return 'getpocket.com' }
    
    consumer_key: string
    access_token: string
    username: string
    requestToken: PocketRequestToken
    logger: Console
    applicationRates: PocketConsumerKeyRateLimits

    //#region Authentication and authorization

    requestAuthentication (redirect_uri: string) : Promise<URL> {
        return new Promise((resolve) => {
            const { options, payload } = this.#buildRequest('/v3/oauth/request', { redirect_uri })

            const req = request(options, (res) => {
                res.on('data', (data) => {
                    if (res.statusCode === 200) {
                        this.requestToken = JSON.parse(data) as PocketRequestToken
                        const { code } = this.requestToken
                        resolve(new URL(`https://${this.host}/auth/authorize?request_token=${code}&redirect_uri=${redirect_uri}`))
                    } else {
                        this.#logPocketError(res)
                        resolve(null)
                    }
                })
            })

            req.write(payload)

            req.on('error', (err) => {
                this.logger.error(err)
                resolve(null)
            })

            req.end()
        })
    }

    authorize () : Promise<PocketAccessToken> {
        const { code } = this.requestToken

        return new Promise((resolve) => {
            const { options, payload } = this.#buildRequest('/v3/oauth/authorize', { code })
            const req = request(options, (res) => {
                res.on('data', (data) => {
                    if (res.statusCode === 200) {
                        const accessToken = JSON.parse(data) as PocketAccessToken
                        this.access_token = accessToken.access_token
                        this.username = accessToken.username
                        resolve(accessToken)
                    } else {
                        this.#logPocketError(res)
                        resolve(null)
                    }
                })
            })

            req.on('error', (err) => {
                this.logger.error(err)
                resolve(null)
            })

            req.write(payload)

            req.end()
        })
    }

    //#endregion

    //#region https://getpocket.com/v3/add

    /**
     * @todo Test edge cases and exception handling
     */
    async add (items: PocketItemToAdd | PocketItemToAdd[]) : Promise<PocketListItem[]> {
        if (Array.isArray(items)) {
            const results = await this.#performBasicActions(items.map((item) => ({
                action: 'add',
                time: new Date().getTime(),
                ...item
            }))) as PocketBasicActionResult[]

            return results.map(result => (result.success as PocketListItem))
        } else {
            return new Promise((resolve) => {
                const { options, payload } = this.#buildRequest('/v3/add', items)
                let contents = ''
                const req = request(options, (res) => {
                    res.on('data', (data) => {
                        if (res.statusCode === 200) {
                            contents += data
                            this.#updateRateLimitStatus(res)
                        } else {
                            this.#logPocketError(res)
                            resolve(null)
                        }
                    })
                    
                    res.on('end', () => {
                        const { item } = JSON.parse(contents)
                        resolve([ item as PocketListItem ])
                    })
                })
        
                req.on('error', (err) => {
                    this.logger.error(err)
                    resolve(null)
                })
    
                req.write(payload)
        
                req.end()
            })
        }
    }

    //#endregion

    //#region https://getpocket.com/v3/get

    get (params: PocketGetParams, listOptions?: PocketListOptions) : Promise<PocketListItem[]> {
        const DEFAULT_PARAMS : PocketGetParams = { detailType: 'simple' }

        return new Promise((resolve) => {
            const { options, payload } = this.#buildRequest('/v3/get', Object.assign({}, DEFAULT_PARAMS, params, listOptions))
            let contents = ''
            const req = request(options, (res) => {
                res.on('data', (data) => {
                    if (res.statusCode === 200) {
                        this.#updateRateLimitStatus(res)
                        contents += data
                    } else {
                        this.#logPocketError(res)
                        resolve(null)
                    }
                })

                res.on('end', () => {
                    const { list } = JSON.parse(contents)

                    resolve(Object.keys(list).map((key) => {
                        return list[key]
                    }) as PocketListItem[])
                })
            })

            req.on('error', (err) => {
                this.logger.error(err)
                resolve(null)
            })

            req.write(payload)
    
            req.end()
        })
    }

    getFavorites (params: PocketGetParams, listOptions?: PocketListOptions) : Promise <PocketListItem[]> {
        const override: PocketGetParams = { favorite: 1 } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getAll (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { state: 'all' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getUnread (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { state: 'unread' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getArchive (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { state: 'archive' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getArticles (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { contentType: 'article' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getVideos (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { contentType: 'video' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    getImages (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]> {
        const override: PocketGetParams = { contentType: 'image' } 
        return this.get(Object.assign({}, params, override), listOptions)
    }

    //#endregion

    #performBasicActions (actions: object[]) : Promise<PocketBasicActionResult[]> {
        
        return new Promise((resolve) => {

            const { options, payload } = this.#buildRequest('/v3/send', Object.assign({}, { actions }))
            let contents = ''
            const req = request(options, (res) => {
                res.on('data', (data) => {
                    if (res.statusCode === 200) {
                        this.#updateRateLimitStatus(res)
                        contents += data
                    } else {
                        this.#logPocketError(res)
                        resolve(null)
                    }
                })

                res.on('end', () => {
                    const results = JSON.parse(contents)
                    resolve(actions.map((action, index) => {
                        return Object.assign({}, action, { 
                            success: results.action_results[index], 
                            error:  results.action_errors[index],
                        }) as PocketBasicActionResult
                    }))
                })
            })

            req.on('error', (err) => {
                this.logger.error(err)
                resolve(null)
            })

            req.write(payload)
    
            req.end()
        })
    }

    async archive (items: number[]) : Promise<PocketBasicActionResult[]> {
        return await this.#performBasicActions(items.map((item_id) => ({
            action: 'archive',
            item_id,
            time: new Date().getTime()
        })))
    }

    async readd (items: number[]) : Promise<PocketBasicActionResult[]> {
        return await this.#performBasicActions(items.map((item_id) => ({
            action: 'readd',
            item_id,
            time: new Date().getTime()
        })))
    }

    async favorite (items: number[]) : Promise<PocketBasicActionResult[]> {
        return await this.#performBasicActions(items.map((item_id) => ({
            action: 'favorite',
            item_id,
            time: new Date().getTime()
        })))
    }

    async unfavorite (items: number[]) : Promise<PocketBasicActionResult[]> {
        return await this.#performBasicActions(items.map((item_id) => ({
            action: 'unfavorite',
            item_id,
            time: new Date().getTime()
        })))
    }

    async delete (items: number[]) : Promise<PocketBasicActionResult[]> {
        return await this.#performBasicActions(items.map((item_id) => ({
            action: 'delete',
            item_id,
            time: new Date().getTime()
        })))
    }
    
    //#region Private methods

    /**
     * @private Builds the options and the serialized payload to perform a valid JSON request
     * to the Pocket API
     * @param path Pocket API endpoint
     * @param data Payload to POST
     * @returns options and payload for the API Request
     * 
     */
     #buildRequest (path: string, data: any) : PocketRequestData {
        if (typeof this.consumer_key === 'string') {
            data.consumer_key = this.consumer_key
        }

        if (typeof this.access_token === 'string') {
            data.access_token = this.access_token
        }
        
        const options = {
            host: this.host,
            method: 'POST',
            port: 443,
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-Accept': 'application/json'
            },
            path: path.startsWith('/') ? path : '/' + path,
        }

        const payload = JSON.stringify(data)

        return { options, payload }
    }

    /**
     * @private Logs the relevant information about an error from the headers 
     * in the response message from the Pocket API. See https://getcom/developer/docs/errors
     * @param response HTTPS response message from the Pocket API
     */
    #logPocketError (response: IncomingMessage) : void {
        this.logger.error(`${response.headers.status}
        Pocket Error ${response.headers['x-error-code']}: ${response.headers['x-error']}`)
    }

    /**
     * @private Stores information about the current [rate limit](https://getpocket.com/developer/docs/rate-limits) 
     * of the application from the headers
     * @param response HTTPS response message from the Pocket API
     */
    #updateRateLimitStatus (response: IncomingMessage) : void {       
        this.applicationRates.limit = parseInt(response.headers['x-limit-key-limit'] as string)
        this.applicationRates.remaining = parseInt(response.headers['x-limit-key-remaining'] as string)
        this.applicationRates.secondsToReset = parseInt(response.headers['x-limit-key-reset'] as string)
    }
    //#endregion
}
