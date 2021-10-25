# pocket-client
HTTPS client for Node that abstracts the [Pocket v3 API](https://getpocket.com/developer/docs/overview).

## Example: authentication and authorization workflow
This is a simple example of the authentication and authorization workflow using Node’s ``https`` 
built-in module and the [``open``](https://www.npmjs.com/package/open) NPM package to redirect the user
to the Pocket authorization page.

See [the documentation](https://getpocket.com/developer/docs/authentication) for more detailed information
on the authentication and authorization workflow and on how to obtain a platform consumer key for your application.

```javascript
import { PocketClient } from 'pocket-client'
import { createServer } from 'https'
const open = require('open') // to open the authorization webpage

// Setup the client with your application consumer key
const pocket = new PocketClient({ 
    consumer_key: '1234-abcd1234abcd1234abcd1234'
})

// Send the authentication request to Pocket and provide a return URL.
//
// If your consumer key is valid, Pocket will provide you with a token
// to request the user authorization: this method will return the
// URL to redirect the user to
//
// In order to complete the authorization process, you must provide a 
// return URL your application is listening to (see below)
const url = await pocket.requestAuthentication('http://localhost:8020')

// Open the Pocket authorization page in the user’s default browser
await open(url.href)

// Create a server to listen to the return URL you sent with the 
// authentication request
const server = createServer(async (req, res) => {
    // prevent duplicate requests from browser (/ and /favicon.ico)
    if (req.url.includes('favicon.ico')) {
        return
    }

    try {
        // Now you can authorize your application
        const token = await pocket.authorize()

        // If the user authorized your application
        // you’re good to go!
        res.write(`<!DOCTYPE html>
            <html>
                <head>
                    <title>Authorized!</title>
                </head>
                <body>
                    <h1>Hello ${token.username}!</h1>
                </body>
            </html>`
        )
    }
    catch (error) {
        console.error(error)
        
        // Notify the user that something went wrong
        res.write(`<!DOCTYPE html>
            <html>
                <head>
                    <title>Error!</title>
                </head>
                <body>
                    <h1>Something went wrong...</h1>
                </body>`
        )
    }

    res.end()
    
    // everything done
    server.close()
})

// Listen for the redirect from Pocket
server.listen(8020)

```
