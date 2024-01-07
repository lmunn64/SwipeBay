
var searchResults = window.localStorage.getItem('searchValue');

// Loads saved search cards HTML and injects into Slick swipe carousel
onload = () => {
    if(searchResults){
    var divContainer = document.getElementById('swipe');
    divContainer.innerHTML = searchResults;
    swipeFunction()
    }
}
function swipeFunction(){ 
     $(document).ready(function(){
    $('.swipe').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      initialSlide: 1,
      adaptiveHeight: false,
      arrows: false
    });
  });

}
 