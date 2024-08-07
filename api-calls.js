const https = require('https');

require('dotenv').config()

const express=require('express');

const api_key = process.env.API_KEY;
const ru_name = process.env.RU_NAME
const client_secret = process.env.CLIENT_SECRET

const b64encode = btoa(api_key+':'+client_secret);

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
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+api_key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge'
var JSONData
var authToken;



const app=express();
const bodyParser = require('body-parser');
const PORT=3000;
const cors=require('cors');
console.log(api_key)
app.use(cors())

// Middleware
app.use(bodyParser.json());

const options = {
    origin: 'http://localhost:3000',
    }
app.use(cors(options))

const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: api_key,
    clientSecret: client_secret,
    redirectUri: ru_name
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
        body: '<?xml version="1.0" encoding="utf-8"?><GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <RequesterCredentials><eBayAuthToken>'+authToken+'</eBayAuthToken></RequesterCredentials></GetUserRequest>'
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

app.get('/key', cors(), (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
  });
  console.log(api_key);
  res.send(api_key);
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

