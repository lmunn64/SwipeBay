
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
function getRefreshToken(){
  if(localStorage.getItem("last_user")){
    var user_id = localStorage.getItem("last_user")
    return fetch('http://127.0.0.1:3000/updateUserToken', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id: user_id})
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0][0].refresh_token)
      })
  }
  else
    console.log("There is no previous user to fetch a request_token from")
  
}
// Make a GET request
function getSearchData(){
  return fetch('http://swipebay.serveo.net:3000/search',{
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
async function getUser(access_token){
  console.log("Fetching user info")
  return fetch('http://127.0.0.1:3000/userInfo',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({access_token: access_token})
  })
  .then((response)=> response.text())
  .then((data)=> {
    xmlReq = jQuery.parseXML(data);
    $xml = $(xmlReq);
    $user = $xml.find("UserID");
    $email = $xml.find("Email");
    console.log($email.text())
    window.localStorage.setItem('last_user', $user.text());
    window.sessionStorage.setItem('user_email', $email.text());

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
  .then((response)=> response.text())
  .then((body)=> {
    console.log(body)
    return body
  })
}

//Parses response and builds an HTML div variable stored in sessionStorage
async function findItemsByKeywords(){
  var items = JSONData.findItemsAdvancedResponse[0].searchResult[0].item || [];
  var temp = document.createElement('div')
  for (var i = 0; i < items.length; i++){
    //card id
    var itemId = i;

    var item = items[i];
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
      createCards(itemId, pic, title, price, viewItem, temp, bids, timeLeft)
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
    await findItemsByKeywords();
    if(isIndexPage){
      window.location.assign("./swipe.html");
      isIndexPage = false;
    }
    else
      window.location.assign("./swipe.html");
    console.log(JSONData)
}

function sendNewUser(firstName, lastName, password){
  email = sessionStorage.getItem("user_email")
  userName = localStorage.getItem("last_user")
  return fetch('http://127.0.0.1:3000/addUser', {
    method : 'POST',
    headers:{
      'Content-Type' : 'application/json' 
    },
    body: JSON.stringify({userName: userName, 
                          email: email, 
                          password, password,
                          firstName: firstName, 
                          lastName: lastName,
                          })
    })
  .then(window.location.assign("./index.html"))
}

function changeCategoryText(category){
    document.querySelector("#category").value = category.value
    document.querySelector('#categoryButton').innerHTML = category.innerHTML
}

function setLogInDiv(isLoggedIn){
  var div = document.getElementById("bottom");

  if(isLoggedIn){
    div.setAttribute("class", "fixed-bottom my-4")

    var text = document.createElement("p")
    text.setAttribute("class", "text-center")
    text.setAttribute("style", "font-size : small; color : grey")

    text.innerText = "Logged in as:"

    var user = document.createElement("p")
    user.setAttribute("class", "text-center")
    user.innerText = localStorage.getItem("last_user")
    user.setAttribute("style", "font-size : small; color : grey")

    var buttonDiv = document.createElement("div")
    buttonDiv.setAttribute("class", "row justify-content-center")

    var button = document.createElement("button")
    button.setAttribute("class", "btn btn-outline-primary btn-sm")
    button.setAttribute("id", "submit")
    button.setAttribute("role", "button")
    button.innerText = "Log Out"
    button.setAttribute("onclick", "logout()")
    
    buttonDiv.append(button)

    div.appendChild(text)
    div.appendChild(user)
    div.appendChild(buttonDiv)
  }
  else{
    div.setAttribute("class", "fixed-bottom my-4")

    var text = document.createElement("p")
    text.setAttribute("class", "text-center")

    text.setAttribute("style", "font-size : small; color : grey")
 
    
    text.innerText = "Allow swipeBay to use your eBay account to add items to watchlist and other things I might add!"

    var buttonDiv = document.createElement("div")
    buttonDiv.setAttribute("class", "row justify-content-center")

    var button = document.createElement("button")
    button.setAttribute("class", "btn btn-outline-primary btn-sm")
    button.setAttribute("id", "submit")
    button.setAttribute("role", "button")
    button.setAttribute("onclick", "window.location.assign('./login.html')")
    button.innerText = "Log In"

    var user = document.createElement("p")
    user.setAttribute("style", "color : grey")

    buttonDiv.appendChild(button)

    div.appendChild(text)
    div.appendChild(user)
    div.appendChild(buttonDiv)
  }
}

function logout(){
  window.localStorage.setItem("loggedIn", 0)
  window.location.assign("./index.html")
}

async function login(user_id, password){
  var loginData
  try{
    const response = await fetch('http://127.0.0.1:3000/login', {
    method : 'POST',
    headers:{
      'Content-Type' : 'application/json' 
    },
    body: JSON.stringify({
                          user_id: user_id,
                          password, password
                        })
    })
    if(response.ok){
      window.localStorage.setItem("last_user", user_id)
      window.localStorage.setItem("loggedIn", 1)
      window.location.assign("./index.html")
      console.log(loginData)
    }
    else{
      throw new Error(response.status)
    }
  } catch (error){
    console.error('Fetch', error)
    loginerr = document.getElementById("login_error")
    loginerr.setAttribute("class","d-block p-2")
  }
}

function checkRegistered(email){
  fetch('http://127.0.0.1:3000/userExist', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
                            email: email
                          })
  })
  .then((response) => response.text())
  .then((data) => {
    console.log(data)
    return data
  })
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
  if (Number.parseInt(newArr[0])){
    return newArr[0] + "d " + newArr[1] + "h" + " left"
  }
  if(Number.parseInt(newArr[1])){
    return newArr[1] + "h " + newArr[2] + "m" + " left"
  }
  else
    return newArr[2] + "m " + newArr[3] + "s" + " left"
}

// Function to create separate Bootstrap cards for each item
async function createCards(card_id, pic, title, price, url, container, bids, time){
  var divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.setAttribute("id", card_id)

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
  trackButton.setAttribute("onclick", `openTrack(${card_id})`)
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
  cardTitle.setAttribute("id", `title_${card_id}`)
  cardTitle.style.fontFamily = "Verdana"

  cardTitle.innerText = title;

  cardBody.append(cardTitle);

  priceDiv.append(cardText);
  priceDiv.append(listingTypeText);
  
  cardBody.append(priceDiv);
  cardBody.append(buttonGroup);

  divCard.append(cardBody);

  container.appendChild(divCard); 
  console.log(divCard.innerHTML);
}

async function openTrack(card_id){
  document.getElementById("main").setAttribute('class', 'container border unclickable');
  await createTrackItem(card_id)
  var popupId = `popup_${card_id}`
  var overlayId = `overlay_${card_id}`
  const overlay = document.getElementById(overlayId)
  const popup = document.getElementById(popupId)
  
  overlay.classList.toggle("hidden")
  popup.classList.toggle("hidden")

  popup.style.opacity = popup.style.opacity === "1" ? "0": "1";
  console.log("openFn")
}
async function closeTrack(card_id){
  
  var popupId = `popup_${card_id}`
  var overlayId = `overlay_${card_id}`
  const overlay = document.getElementById(overlayId)
  const popup = document.getElementById(popupId)

  overlay.classList.toggle("hidden")
  popup.classList.toggle("hidden")

  var mainDiv = document.getElementById("main")
  mainDiv.setAttribute('class', 'container border');
  var trackDiv = document.getElementById("track")
  trackDiv.removeChild(popup)
}

async function createTrackItem(card_id){
  var divPopup = document.createElement("div");
  divPopup.setAttribute("class", "position-fixed hidden");
  divPopup.setAttribute("id", `popup_${card_id}`)

  var divInput = document.createElement("div");
  divInput.setAttribute("class", "container border input-group mb-3")
  divInput.setAttribute("id", `$input_div_${card_id}`)

  const title = document.getElementById(`title_${card_id}`).innerText
  const titleArray = title.split(/[-+\s,*)!/({:}.&]+/)
  for(var i = 0; i < titleArray.length; i++){
    if(titleArray[i] != ''){
      var button = document.createElement("button")
      button.setAttribute("class","btn btn-sm btn-outline-secondary")
      button.setAttribute("onclick", "this.remove()")
      button.setAttribute("type", "button")
      button.innerHTML = `${titleArray[i]} &#x00d7;`
      divInput.append(button)
    }
  }

  var topText = document.createElement("h4")
  topText.setAttribute("class", "text-center col-md-12")
  topText.setAttribute("style", "font-family : Century Gothic")
  topText.setAttribute("style", "font-weight : 800")
  topText.innerText ="Track this Item"

  var editText = document.createElement("h6")
  editText.setAttribute("class", "text-center col-md-12 my")
  editText.setAttribute("style", "font-family : Century Gothic")
  editText.setAttribute("style", "font-weight : 700")
  editText.innerText ="edit keywords"

  var buttonBody = document.createElement("div");
  buttonBody.setAttribute("class", "col-md-12")

  var buttonGroup = document.createElement("div");
  buttonGroup.setAttribute("class" , "text-center");

  var exitButton = document.createElement("button")
  exitButton.setAttribute("class","btn btn-sm btn-outline-primary")
  exitButton.setAttribute("onclick", `closeTrack(${card_id})`)
  exitButton.innerHTML = "Close"

  buttonBody.append(exitButton);

  var buttonBody2 = document.createElement("div");
  buttonBody2.setAttribute("class", "col-md-12")

  var trackButton = document.createElement("button")
  trackButton.setAttribute("class", "btn btn-primary btn-md my-2");
  trackButton.innerText = "Track"
  trackButton.setAttribute("onclick", ``)
  buttonBody2.append(trackButton);
  
  buttonGroup.append(buttonBody2);
  buttonGroup.append(buttonBody);

  var divOverlay = document.createElement("div");
  divOverlay.setAttribute("class", "hidden");
  divOverlay.setAttribute("id", `overlay_${card_id}`)

  divPopup.append(topText)
  divPopup.append(editText)
  divPopup.append(divInput)
  divPopup.append(divOverlay)
  divPopup.append(buttonGroup)

  document.getElementById("track").append(divPopup)
}        
