/** Options and payload for a JSON request */
type PocketRequestData = {
    /** Request options @todo learn how to import the correct type from http */
    options: any,
    /** stringified JSON payload */
    payload: string
}

/** Response to a successful request to the authentication endpoint */
type PocketRequestToken = {
    code: string
}

/** Response to a successful request to the authorization endpoint */
type PocketAccessToken = {
    /** Pocket Username for display purposes */
    username: string
    /** Pocket Application Access Token to be used in each authorized request */
    access_token: string
}

/** Data to save a single item */
type PocketItemToAdd = {
    /** The URL of the item to save */
    url: string
    /** Ignored if Pocket detects a title from the content at the URL */
    title?: string
    /** Comma-separated list of tags to be applied to the item */
    tags?: string
}


type PocketListOptions = {
    sort?: 'newest' | 'oldest' | 'title' | 'site'
    count?: number
    offset?: number
}

type PocketGetParams = {
    state?: 'unread' | 'archive' | 'list'
    favorite?: 0 | 1
    contentType?: 'article' | 'image' | 'video'
    tag?: string | '_untagged_'
    detailType?: 'simple' | 'complete'
    search?: string
    domain?: string
    since?: number
}


/** Item in a Pocket List */
type PocketListItem = {
    item_id: string | number
    resolved_id: string | number
    normal_url: string
    resolved_url: string
    domain_id: string | number
    origin_domain_id: string | number
    response_code: string | number
    mime_type: string
    content_length: string | number
    eocoding: string
    date_resolved: string
    date_published: string
    title: string
    excerpt: string
    word_count: string | number
    has_image: 0 | 1 | 2
    has_video: 0 | 1 | 2
    is_index: 0 | 1
    is_article: 0 | 1
    authors: string[]
    images: string[]
    videos: string[]
}

/** Configuration object to initialize a new instance of the Pocket API client */
type PocketAPIConfig = {
    /** Application Consumer Key */
    consumer_key: string,
    /** Previously stored Access Token and Username if the User has already authorized the application */
    token?: PocketAccessToken,
    /** Logger object */
    logger?: Console
}

type PocketConsumerKeyRateLimits = {
    /** Current rate limit enforced per consumer key */
    limit: number,
    /** Number of calls remaining before hitting consumer key's rate limit */
    remaining: number,
    /** Seconds until consumer key rate limit resets */
    secondsToReset: number
}

declare class PocketAPI {
    constructor (config : PocketAPIConfig)

    /** @readonly Pocket host for API requests */
    get host() : string
    /** Pocket Application Consumer Key, used in each request */
    consumer_key: string
    /** Stored Pocket Authentication Request Token, used to authorize the User  */
    requestToken: PocketRequestToken
    /** Pocket Application Access Token to be used in each authorized request */
    access_token: string
    /** Pocket Username for display purposes */
    username: string
    /** 
     * If at least one request to the Pocket API has been made, the
     * [rate limits](https://getpocket.com/developer/docs/rate-limits) relative to
     * the current consumer key are stored in this variable, otherwise all values are ``undefined``
     * */
    applicationRates: PocketConsumerKeyRateLimits

    /**
     * Requests authentication to the Pocket API as per https://getpocket.com/developer/docs/authentication
     * at step 2
     * @param redirect_uri URI to redirect the User to once authenticate
     * @returns Pocket URL to redirect the User to in order to authenticate
     */
    requestAuthentication (redirect_uri: string) : Promise<URL>

    /**
     * Once the User has authenticated to Pocket and granted permission to your App, 
     * completes the authorization process as per https://getpocket.com/developer/docs/authentication
     * at step 5
     * @returns Pocket Access Token and Pocket Username
     */
    authorize () : Promise<PocketAccessToken>

    /**
     * Add an Article to the User’s Pocket List
     * @param payload Article to add
     * @returns Added article
     */
    add (article: PocketItemToAdd) : Promise<PocketListItem>

    /**
     * Retrieves a list of items from Pocket as per 
     * https://getpocket.com/developer/docs/v3/retrieve
     * @param params List filtering and search parameters
     * @param listOptions Pagination and sorting options
     */
    get (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of favorite items from Pocket – alias for ``PocketClient.get`` with ``params.favorite``
     * forced to ``1``
     * @param params List filtering and search parameters – the ``favorite`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
    getFavorites (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of unread items from Pocket – alias for ``PocketClient.get`` with ``params.state``
     * forced to ``unread``
     * @param params List filtering and search parameters – the ``state`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
    getUnread (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of archived items from Pocket – alias for ``PocketClient.get`` with ``params.state``
     * forced to ``archive``
     * @param params List filtering and search parameters – the ``state`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
    getArchive (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of articles from Pocket – alias for ``PocketClient.get`` with ``params.contentType``
     * forced to ``article``
     * @param params List filtering and search parameters – the ``contentType`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
    getArticles (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of videos from Pocket – alias for ``PocketClient.get`` with ``params.contentType``
     * forced to ``video``
     * @param params List filtering and search parameters – the ``contentType`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
     getVideos (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>

    /**
     * Retrieves a list of images from Pocket – alias for ``PocketClient.get`` with ``params.contentType``
     * forced to ``image``
     * @param params List filtering and search parameters – the ``contentType`` param is ignored)
     * @param listOptions Pagination and sorting options
     */
     getImages (params: PocketGetParams, listOptions: PocketListOptions) : Promise<PocketListItem[]>
}
