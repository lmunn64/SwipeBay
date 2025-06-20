const EbayAuthToken = require('ebay-oauth-nodejs-client');
const config = require('./config/environment');

const ebayAuthToken = new EbayAuthToken({
    clientId: config.EBAY.API_KEY,
    clientSecret: config.EBAY.CLIENT_SECRET,
    redirectUri: config.EBAY.RU_NAME
});

const scopes = ['https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.marketing',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.account',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
];

module.exports = {ebayAuthToken, scopes}