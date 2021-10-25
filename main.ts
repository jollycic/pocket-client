import { IncomingMessage } from 'http'
import { request } from 'https'

export default class PocketClient implements PocketAPI {

    constructor ({ consumer_key, token, logger } : PocketAPIConfig) {
        this.consumer_key = consumer_key
        
        if (token) {
            this.access_token = token.access_token
            this.username = token.username
        }

        this.logger = logger ?? console
    }

    get host () { return 'getpocket.com' }
    
    consumer_key: string
    access_token: string
    username: string
    requestToken: PocketRequestToken
    logger: Console

    #buildRequest (path: string, data: any) {
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
            path,
        }

        return { options, payload: JSON.stringify(data) }
    }

    #logPocketError (response: IncomingMessage) : void {
        this.logger.error(`${response.headers.status}
        Pocket Error ${response.headers['x-error-code']}: ${response.headers['x-error']}`)
    }

    requestAuthentication (redirect_uri: string) : Promise<URL> {
        return new Promise((resolve, reject) => {
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

        return new Promise((resolve, reject) => {
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
                reject(err)
            })

            req.write(payload)

            req.end()
        })
    }

    add (article: PocketAdd) : Promise<PocketListItem> {
        return new Promise((resolve, reject) => {
            const { options, payload } = this.#buildRequest('/v3/add', article)
            const req = request(options, (res) => {
                res.on('data', ({ item }) => {
                    resolve(JSON.parse(item) as PocketListItem)
                })
            })
    
            req.on('error', (err) => {
                reject(err)
            })

            req.write(payload)
    
            req.end()
        })
    }
}
