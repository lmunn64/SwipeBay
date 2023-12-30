// Define the API URL
const key = 'LukeMunn-SwipeBay-PRD-a83712ee4-498c5642';
var keyword
var url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&itemFilter.name=MaxPrice&itemFilter.value=10.00&itemFilter.paramName=Currency&itemFilter.paramValue=USD&paginationInput.entriesPerPage=6'

var data

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
  // return console.log(data);
}

//Parses response and builds an HTML table to display search results
async function _cb_findItemsByKeywords(){
  await getData();
  var items = data.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  // console.log(items)
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
  
function search(value){
    let keyword = value
    url = 'https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.3.1&SECURITY-APPNAME='+key+'&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords='+keyword+'&paginationInput.entriesPerPage=6'
    getData();
    _cb_findItemsByKeywords();
  }

//  const form = document.getElementById('form')
//  if(form){
//     form.addEventListener('submit', function(){  
//       search(document.getElementById('search').value())
//     })
//   }

  
