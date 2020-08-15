var aux=require("./server");


// Initialize and add the map
function initMap() {
    var emma = {lat: 41.894798, lng: 12.4751301};

    var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: emma});

    var marker = [];

    for(var i=0;i<10;i++){
        marker[i]=new google.maps.Marker({position:{lat:41.8+i, lng:12.4+i}, map:map});
    }
  }