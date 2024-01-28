const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
const ruName = 'Luke_Munn-LukeMunn-SwipeB-fkbal'
const client_secret = 'PRD-83712ee43d82-09b8-4b7d-9da3-5102';
const b64encode = btoa(key+':'+client_secret);

const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642',
    clientSecret: 'PRD-83712ee43d82-09b8-4b7d-9da3-5102',
    redirectUri: 'Luke_Munn-LukeMunn-SwipeB-fkbal'
});