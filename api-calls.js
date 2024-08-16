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
var url 
var JSONData
var authToken;
var refresh_token
const app = express();

const database = require("./database.js")
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
const { data } = require('jquery');

const ebayAuthToken = new EbayAuthToken({
    clientId: api_key,
    clientSecret: client_secret,
    redirectUri: ru_name
});

//Add user to local database
app.post("/addUser", cors(), async (req, res) => {
  try{
    //Check if response body contains data
    console.log(req.body)
    if(!req.body){
      const msg = "POST: Bad request: No data provided.";
      console.log(msg);
      return res.status(400).send({error:msg})
    }

    //Check if table exists
    const [tableExists] = await database.query("SHOW TABLES LIKE 'users'");
    if(tableExists.length === 0){
      const msg = "POST: Table does not exist.";
      console.log(msg);
      return res.status(404).send({error:msg})
    }
    console.log("POST: Table does exist.");

    //Check if user exists
    const usrnm = req.body.userName; 
  
    const userExists = database.query("SELECT * FROM users WHERE userName = ?", [usrnm]);
    console.log("POST: User doesn't exist.");
    if(userExists){
      const msg = "POST: User already exists";    
      console.log(msg);
      return res.status(409).send({error:msg})
    }
    console.log("POST: User doesn't exist.");
    
    //Add user
    const {userName, email, firstName, lastName, refresh_token} = req.body;
    const insertSQL = "INSERT INTO users (userName, email, firstName, lastName, refresh_token) VALUES (?, ?, ?, ?, ?)";
    const insertResult = await database.query(insertSQL, [userName, email, firstName, lastName, refresh_token])

    const msg = "POST: Successfully added user";    
    console.log(msg);
    return res.status(200).send({success:msg})
    
    } catch(err) {
      const msg = "POST: An ERROR occurred in Post "+err;
      console.error(msg);
      res.status(500).send({error:msg});
    }
  
})

app.post('/userInfo', cors(), (req,res)=>{
  console.log('/userInfo\n')
  console.log('Auth Token: ' + authToken)
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
      console.log(url)
       res.json(
        data
    );
    })();
})

app.get('/key', cors(), (req, res) => {
  console.log("/key\n")
  res.set({
    "Access-Control-Allow-Origin": "*",
  });
  console.log(api_key);
  res.send(api_key);
})

app.get('/auth', cors(), (req, res) =>{
  console.log("/auth\n")
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
  console.log("/token\n")
  // console.log(req.body.code);
  ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', req.body.code).then((data) => { // eslint-disable-line no-undef
      var response = JSON.parse(data);
      var tokenSet = [response.access_token, response.refresh_token];
      authToken = response.access_token;
      refresh_token = response.refresh_token
      console.log(tokenSet);
      res.send(tokenSet);
    }).catch((error) => {
      console.log(error);
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });
})

app.post('/refreshToken', cors(),(req, res)=>{
  res.set({
    "Access-Control-Allow-Origin": "*"
  });

  console.log(req.body.code);
  ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', req.body.code).then((data) => { // eslint-disable-line no-undef
      var response = JSON.parse(data);
      authToken = response.access_token;
      
      res.send(authToken);
    }).catch((error) => {
      console.log(error);
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });
})
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})

