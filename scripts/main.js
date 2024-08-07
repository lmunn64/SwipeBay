
// Define the API URL
var key
var keyword
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6&outputSelector=pictureURLLarge' 

var JSONData;
var isIndexPage = true;

var itemFilter = [
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

  //Onload functions
  var searchResults = window.sessionStorage.getItem('searchValue');

  // Loads saved search cards HTML and injects into Slick swipe carousel
  onload = () => {
      if(searchResults){ //if on swipe page and has results
      var divContainer = document.getElementById('swipe');
      divContainer.innerHTML = searchResults;
      swipeFunction()
      }
      else{
        var mainDiv = document.getElementById("main")
        var sorry = document.createElement("h4")
        sorry.setAttribute("class", "text-center col-md-12 my")
        sorry.setAttribute("style", "font-family : Century Gothic")
        sorry.setAttribute("style", "font-weight : 800")
        sorry.innerText ="Sorry, there are no results for your search..."
        mainDiv.append(sorry)
      }
      if(localStorage.get("authCode")){

      }
      listingTypeToggle()
  }
  function swipeFunction(){ 
       $(document).ready(function(){ 
      $('.swipe').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        initialSlide: 1,
        adaptiveHeight: false,
        arrows: false,
        mobileFirst: true
      });
    });
  }

function listingTypeToggle(){
  var code = localStorage.getItem("LTToggle")
  if(code == 0)
    document.querySelector("#All").classList.toggle("active")
  else if(code == 1){
    document.querySelector("#Auction").classList.toggle("active")
  }
  else
  document.querySelector("#BIN").classList.toggle("active")
}


// Make a GET request
function getSearchData(){
  return fetch('http://127.0.0.1:3000/search',{
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

//Fetches and redirects to user authorization URL that allows users to authorize app to use their data.
function userAuth(){
  return fetch('http://127.0.0.1:3000/auth')
  .then((response)=> response.text())
  .then((data)=> {
    window.location.assign(data);
  })
  }

//getUser
function getUser(){
  return fetch('http://127.0.0.1:3000/userInfo',{
    method: 'POST'
  })
  .then((response)=> response.text())
  .then((data)=> {
    xmlReq = jQuery.parseXML(data);
    $xml = $(xmlReq);
    console.log(xmlReq);
    $user = $xml.find("UserID");
    $email = $xml.find("Email");
    window.sessionStorage.setItem('userId', $user.text());
    // window.sessionStorage.setItem('Email', $email.text());
    // document.getElementById('user').innerHTML = window.sessionStorage.getItemuserId')
  })
  }

//Parses user authorization code from html on accept.html page after redirect from authorization page
async function getAuthCode(){
  var url =  window.location.href;
  const arra = url.split("=");
  const codearr = arra[1].split('&');
  const authCode = codearr[0];
  return authCode;
}

//Grants token using auth code
async function grantToken(code){
  return fetch('http://127.0.0.1:3000/token',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code: code})  
  })
  .then(console.log("Successful token"))
}

//Parses response and builds an HTML div variable stored in sessionStorage
async function _cb_findItemsByKeywords(){
  var items = JSONData.findItemsAdvancedResponse[0].searchResult[0].item || [];
  var temp = document.createElement('div')
  for (var i = 0; i < items.length; i++){
    var item = items[i]
    var title = item.title;
    if(item.pictureURLLarge == undefined){
      var pic = item.galleryURL;
    }
    else{var pic = item.pictureURLLarge;}
    var viewItem = item.viewItemURL;
    
    var bids = -1
    var timeLeft = -1

    if(item.listingInfo[0].listingType == "Auction" || item.listingInfo[0].listingType== "AuctionWithBIN"){
      bids = item.sellingStatus[0].bidCount
      timeLeft = decodeTimeLeft(String(item.sellingStatus[0].timeLeft))
    }
    //sets price to 2 decimals
    var fixedPrice = parseFloat(item.sellingStatus[0].convertedCurrentPrice[0]["__value__"]).toFixed(2)

    var price = "$" + fixedPrice;
    if (title != null && viewItem != null) {
      createCards(pic, title, price, viewItem, temp, bids, timeLeft)
    }
  }
  window.sessionStorage.setItem("searchValue", temp.innerHTML);
  
  }
function getKey(){
    return fetch('http://127.0.0.1:3000/key')
    .then((response)=> response.text())
    .then((data)=> {
      key = data
      console.log(data)
    })
}

function getCategory(){
  categoryId = document.querySelector("#category").value
  if(categoryId)
   return `&categoryId=${categoryId}`
  else
    return ``
}

function getListingType(){
  listingType = document.querySelector("#LT_auction")
  if(document.querySelector("#Auction").classList.contains("active")){
    localStorage.setItem("LTToggle", 1)
    return `&itemFilter(0).name=ListingType&itemFilter(0).value(0)=Auction`
  }
  if(document.querySelector("#BIN").classList.contains("active")){
    localStorage.setItem("LTToggle", 2)
    return `&itemFilter(0).name=ListingType&itemFilter(0).value(0)=FixedPrice`
  }
  localStorage.setItem("LTToggle", 0)
  return ``
}

//Complete search function
async function search(value){
    await getKey() // sets local key to api key

    keyword = value
    categoryId = getCategory()
    listingType = getListingType()

    url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.3.1&SECURITY-APPNAME=${key}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&keywords=${keyword}${categoryId}${listingType}&paginationInput.entriesPerPage=8&outputSelector=PictureURLLarge`
    
    await getSearchData();
    await _cb_findItemsByKeywords();
    if(isIndexPage){
      window.location.assign("./swipe.html");
      isIndexPage = false;
    }
    else
      window.location.assign("./swipe.html");
    console.log(JSONData)
  }

function changeCategoryText(category){
    document.querySelector("#category").value = category.value
    document.querySelector('#categoryButton').innerHTML = category.innerHTML
z
}

//Takes time code of how much time left there is for a listing and returns a readable time
function decodeTimeLeft(timeCode){
  timeCodeArr = timeCode.split("")
  tempString = ""
  newArr = []
  for(i = 0; i < timeCodeArr.length; i++){
    if(!isNaN(timeCodeArr[i])){
      tempString += timeCodeArr[i]
      console.log(tempString)
    }
    else if(tempString){
      newArr.push(tempString)
      console.log(newArr)
      tempString = ""
    }
  }
  if (newArr[0]){
    return newArr[0] + "d " + newArr[1] + "h" + " left"
  }
  if(newArr[1]){
    return newArr[1] + "h " + newArr[2] + "m" + " left"
  }
  else
    return newArr[2] + "m " + newArr[3] + "s" + " left"
}

// Function to create separate Bootstrap cards for each item
  async function createCards(pic, title, price, url, container, bids, time){
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card");
    var img = document.createElement('img');
    img.setAttribute("src", pic);
    img.setAttribute("class", "card-img-top");

    divCard.append(img);

    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    cardBody.setAttribute("text-align", "center");

    var buttonGroup = document.createElement("div");
    buttonGroup.setAttribute("class" , "text-center");

    var buttonBody = document.createElement("div");
    buttonBody.setAttribute("class", "col-md-12")

    var link = document.createElement("a")
    link.setAttribute("href", url);
    link.setAttribute("class", "btn btn-outline-primary btn-sm");
    link.innerText = "Go to Item"

    buttonBody.append(link)

    var buttonBody2 = document.createElement("div");
    buttonBody2.setAttribute("class", "col-md-12")

    var trackButton = document.createElement("button")
    trackButton.setAttribute("class", "btn btn-primary btn-lg my-2");
    trackButton.innerText = "Track"

    buttonBody2.append(trackButton);
    
    buttonGroup.append(buttonBody2);
    buttonGroup.append(buttonBody);

    var priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "my-2")

    var listingTypeText = document.createElement("p");
    listingTypeText.setAttribute("class", "card-text")
    listingTypeText.setAttribute("style", "margin-top : 0")
    listingTypeText.setAttribute("style", "font-weight : 100")
    listingTypeText.setAttribute("style", "color : grey")

    if(bids != -1){
      listingTypeText.innerText = "Bids: " + bids + " · " + time
    }
    else
      listingTypeText.innerText = "Buy It Now"

    var cardText = document.createElement("h3");
    cardText.setAttribute("class","card-text");
    cardText.setAttribute("style", "margin-bottom : 0px")
    cardText.style.fontFamily = "Century Gothic"
    cardText.setAttribute("style", "font-weight : 850")

    cardText.innerText = price;

    var cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class","card-title");
    cardTitle.style.fontFamily = "Verdana"



    cardTitle.innerText = title;



    // var track = document.createElement("a")
    // track.setAttribute("class", "btn btn-outline-primary");
    // track.setAttribute("")
    // track.innerText = "Track Item"

    cardBody.append(cardTitle);

    priceDiv.append(cardText);
    priceDiv.append(listingTypeText);
    

    cardBody.append(priceDiv);
    cardBody.append(buttonGroup);
  
  
    

    divCard.append(cardBody);

    container.appendChild(divCard); 
    console.log(divCard.innerHTML)
  }
