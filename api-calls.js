const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
const ruName = 'Luke_Munn-LukeMunn-SwipeB-fkbal'
const client_secret = 'PRD-83712ee43d82-09b8-4b7d-9da3-5102';
const b64encode = btoa(key+':'+client_secret);
var keyword = ''
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge'
var JSONData
const https = require('https');

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

app.post('/search', cors(),(req,res)=>{
    res.set({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
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

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})



