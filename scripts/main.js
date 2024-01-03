// Define the API URL
const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
var keyword
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge'
var data
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
async function getData(){
  const response = await fetch(url)
  if (!response.ok){
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  data = await response.json();
}

//Parses response and builds an HTML div variable stored in sessionStorage
async function _cb_findItemsByKeywords(){
  await getData();
  var items = data.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  var html = []
  var temp = document.createElement('div')
  for (var i = 0; i < items.length; i++){
    var item = items[i]
    var title = item.title;
    var pic = item.pictureURLLarge;
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
    let keyword = value
    url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.3.1&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&paginationInput.entriesPerPage=6&outputSelector=PictureURLLarge'
    await getData();
    await _cb_findItemsByKeywords();
    window.location.href = "swipe.html"
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
  
