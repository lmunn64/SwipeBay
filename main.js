// Define the API URL
const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
const url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=harry%20potter%20phoenix&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=8'
var keyword
var jsonResponse

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
function getData(){
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    jsonResponse = data
    return console.log(jsonResponse)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

//Parses response and builds an HTML table to display search results
function _cb_findItemsByKeywords(){
  var items = jsonResponse.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  console.log(items)
  var html = []
  html.push('<table width = "100%" border = "0" cellspacing = "0" cellpaddig = "3"><tbody>');
  for (var i = 0; i < items.length; i++){
    var item = items[i]
    var title = item.title;
    var pic = item.galleryURL;
    var viewItem = item.viewItemURL;
    if (title != null && viewItem != null) {
      html.push('<tr><td>' + '<img src="' + pic + '" border="2">' + '</td>' +
      '<td><a href="' + viewItem + '" target="_blank">' + title + '</a></td></tr>');
    }
  }
  html.push('</tbody></table>');
  document.getElementById("results").innerHTML = html.join("");
  }
