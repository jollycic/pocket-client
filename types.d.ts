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
type PocketAdd = {
    /** The URL of the item to save */
    url: string
    /** Ignored if Pocket detects a title from the content at the URL */
    title?: string
    /** Comma-separated list of tags to be applied to the item */
    tags?: string
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

type PocketAPIConfig = {
    consumer_key: string,
    token?: PocketAccessToken,
    logger?: Console
}

interface PocketAPI {
    /** Pocket Application Consumer Key, used in each request */
    consumer_key: string
    /** Stored Pocket Authentication Request Token, used to authorize the User  */
    requestToken: PocketRequestToken
    /** Pocket Application Access Token to be used in each authorized request */
    access_token: string
    /** Pocket Username for display purposes */
    username: string

    /**
     * Request authentication to the Pocket API: @see https://getpocket.com/developer/docs/authentication,
     * step 2
     * @param redirect_uri URI to redirect the User to once authenticate
     * @returns Pocket URL to redirect the User to in order to authenticate
     */
    requestAuthentication(redirect_uri: string): Promise<URL>

    /**
     * Once the User has authenticated to Pocket and granted permission to ypur App, 
     * complete the authorization process: @see https://getpocket.com/developer/docs/authentication,
     * step 5
     * @returns Pocket Access Token and Pocket Username
     */
    authorize(): Promise<PocketAccessToken>

    /**
     * Add an Article to the User’s Pocket List
     * @param payload Article to add
     * @returns Added article
     */
    add(article: PocketAdd): Promise<PocketListItem>
}