// Define the API URL
const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
const ruName = 'Luke_Munn-LukeMunn-SwipeB-fkbal'
const client_secret = 'PRD-83712ee43d82-09b8-4b7d-9da3-5102';
const b64encode = btoa(key+':'+client_secret);
var keyword
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge'
var JSONData
var myStorage = window.sessionStorage;
var filterarray = [
  {"name":"MaxPrice",
   "value":"25",
   "paramName":"Currency",
   "paramValue":"USD"},
  {"name":"FreeShippingOnly",
   "value":"true",
   "paramName":"",
   "paramValue":""},
  {"name":"ListingType",
   "value":["AuctionWithBIN", "FixedPrice"],
   "paramName":"",
   "paramValue":""},
  ];

// Make a GET request
function getSearchData(){
  return fetch('https://192.168.1.71:3000/search',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: url})
  })
  .then((response)=> response.json())
  .then((data)=>{
    JSONData = data;
    console.log(JSONData)
});
}
async function consent(){
  window.location = 'https://auth.ebay.com/oauth2/authorize?client_id='+key+'&redirect_uri=Luke_Munn-LukeMunn-SwipeB-fkbal&response_type=code&scope=https://api.ebay.com/oauth/api_scope'
  
}
function getAuthCode(){
  var myStorage = window.sessionStorage
  var url =  window.location.href;
  const arra = url.split("=");
  const codearr = arra[1].split('&');
  const authCode = codearr[0];
  myStorage.setItem("authCode", authCode);
  grantRequest()
}
async function grantRequest(){
  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token',{
  method: "POST",
  headers:{
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic' + b64encode
  },
  body: JSON.stringify({
      grant_type: 'authorization_code',
      code: window.sessionStorage.getItem('authCode'),
      redirect_uri: ruName
  })
  });
  if (!response.ok){
  throw new Error(`HTTP error! status: ${response.status}`);
  }
  console.log(response.json());
}
//Parses response and builds an HTML div variable stored in sessionStorage
async function _cb_findItemsByKeywords(){
  var items = JSONData.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  var temp = document.createElement('div')
  for (var i = 0; i < items.length; i++){
    var item = items[i]
    var title = item.title;
    if(item.pictureURLLarge == undefined){
      var pic = item.galleryURL;
    }
    else{var pic = item.pictureURLLarge;}
    var viewItem = item.viewItemURL;
    var price = "$" + item.sellingStatus[0].convertedCurrentPrice[0]["__value__"];
    if (title != null && viewItem != null) {
      createCards(pic, title, price, viewItem, temp)
    }
  }
  myStorage.setItem("searchValue", temp.innerHTML);
  
  }

//Complete search function
async function search(value){
    keyword = value
    url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.3.1&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&paginationInput.entriesPerPage=8&outputSelector=PictureURLLarge'
    await getSearchData();
    await _cb_findItemsByKeywords();
    window.location.assign("swipe.html");
    console.log(JSONData)
  }

// Function to create separate Bootstrap cards for each item
  async function createCards(pic, title, price, url, container){
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card");

    var img = document.createElement('img');
    img.setAttribute("src", pic);
    img.setAttribute("class", "card-img-top");

    divCard.append(img);

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    var cardText = document.createElement("p");
    cardText.setAttribute("class","card-text");
    cardText.innerText = price;

    var cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class","card-title");
    cardTitle.innerText = title;

    var link = document.createElement("a")
    link.setAttribute("href", url);
    link.setAttribute("class", "btn btn-outline-primary");
    link.innerText = "Go to Item"
    
    cardBody.append(cardTitle);
    cardBody.append(cardText);
    cardBody.append(link);
    

    divCard.append(cardBody);

    container.appendChild(divCard); 
    console.log(divCard.innerHTML)
  }
  
