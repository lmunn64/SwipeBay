const https = require('https');
const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
const ruName = 'Luke_Munn-LukeMunn-SwipeB-fkbal'
const client_secret = 'PRD-83712ee43d82-09b8-4b7d-9da3-5102';
const b64encode = btoa(key+':'+client_secret);


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

var keyword = ''
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge'
var JSONData
const authToken = 'v^1.1#i^1#f^0#I^3#r^0#p^3#t^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'

const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const PORT=3000;
const cors=require('cors');

app.use(cors())

// Middleware
app.use(bodyParser.json());

const options = {
    origin: 'http://localhost:3000',
    }
app.use(cors(options))

const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642',
    clientSecret: 'PRD-83712ee43d82-09b8-4b7d-9da3-5102',
    redirectUri: 'Luke_Munn-LukeMunn-SwipeB-fkbal'
});

app.post('/userInfo', cors(), (req,res)=>{
  res.set({
    "Access-Control-Allow-Origin": "*",
    });
    (async () => {
      const response = await fetch("https://api.ebay.com/ws/api.dll",{
        method: 'POST',
        headers: {
          'X-EBAY-API-SITEID': '0',
          'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
          'X-EBAY-API-CALL-NAME': 'GetUser',
          'X-EBAY-API-IAF-TOKEN': authToken,
        },
        body: '<?xml version="1.0" encoding="utf-8"?><GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <RequesterCredentials><eBayAuthToken>v^1.1#i^1#f^0#I^3#r^0#p^3#t^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</eBayAuthToken></RequesterCredentials></GetUserRequest>'
      });
      let data = await response.text();
      console.log(data)
      res.send(data);
    })();
})
app.post('/search', cors(),(req,res)=>{
    res.set({
      
    });
    url = req.body.url;
    (async () => {
      const response = await fetch(url);
      let data = await response.json();
      console.log(JSON.stringify(data))
       res.json(
        data
    );
    })();
   
})
app.get('/auth', cors(), (req, res) =>{
  res.set({
    "Access-Control-Allow-Origin": "*",
  });
    const authUrl = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes);
    console.log(authUrl);
    res.send(authUrl);
})

app.post('/token', cors(),(req, res)=>{
  res.set({
    "Access-Control-Allow-Origin": "*"
  });

  console.log(req.body.code);
  ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', req.body.code).then((data) => { // eslint-disable-line no-undef
      var response = JSON.parse(data);
      authToken = response.access_token;
      console.log(authToken);
      res.send(authToken);
    }).catch((error) => {
      console.log(error);
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})



