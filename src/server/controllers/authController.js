const { ebayAuthToken, scopes } = require('../ebay');
const config = require('../config/environment');
const axios = require('axios')

class AuthController {
    static async getAuthURL(req, res){
        try {
            console.log("Running getAuthURL...\n")

            // res.set({
            //     "Access-Control-Allow-Origin": "*",
            // });
            console.log(scopes)
            const authUrl = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes);
            console.log("Generated auth URL:", authUrl);
            res.redirect(authUrl);
        } catch (error) {
            console.error('Error generating auth URL:', error);
            res.status(500).send('Error generating authorization URL');
        }
    }
    static async exchangeAuthCode(req, res){
        try{
            console.log("Running exchangeAuthToken...\n")

            // res.set({
            //     "Access-Control-Allow-Origin": "*"
            // });

            const code = req.body.code
            console.log("code: ", code)
            if(!code){
                return res.status(400).json({error: 'Authorization code is required'})
            }

            const token = await ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', code) 

            console.log(`Access Token: ${token}`)

            res.json({ 
                access_token: token.access_token,
                refresh_token: token.refresh_token,
                expires_in: token.expires_in
            });
        } catch (error) {
            console.log(`Error grabbing access token :${JSON.stringify(error)}`);
            res.status(500).json({error: 'Failed to refresh access token'})
        }
    }

    // refresh the token with the refresh token
    static async refreshToken(req, res){
        try{
            const { refreshToken } = req.body

            if(!refreshToken){
                return res.status(400).json({error: 'Refresh token is required'})
            }
    
            const token =  await ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes)
            console.log(`Access Token: ${token.access_token}`)

            res.json({ 
                access_token: token.access_token,
                expires_in: token.expires_in
            });
        } catch (error) {
            console.log(`Error refreshing token :${JSON.stringify(error)}`);
            res.status(500).json({error: 'Failed to refresh access token'})
        }
    }
    static async getApplicationToken(req, res) {
        try {
            const credentials = Buffer.from(`${config.EBAY.API_KEY}:${config.EBAY.CLIENT_SECRET}`).toString('base64');
            

            const response = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', 
                'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );

            res.json({
                access_token: response.data.access_token,
                expires_in: response.data.expires_in
            })
        } catch (error) {
            console.error('Error getting application token:', error);
            throw error;
        }
    }
}

module.exports = AuthController;