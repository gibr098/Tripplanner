var server=require('./server')

/* Initialize and add the map
function initMap() {
    var emma = {lat: 41.894798, lng: 12.4751301};

    var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: emma});

    var marker = [];

    for(var i=0;i<10;i++){
        marker[i]=new google.maps.Marker({position:{lat:41.8+i, lng:12.4+i}, map:map});
    }
  }
  */

  /* for(var i=0;i<10;i++){
                        marker[i]=new google.maps.Marker({position:{lat: {info.results[i].geometry.location.lat}, lng: {info.results[i].geometry.location.lng}, map:map});

                    }*/



                function initMap() {
                    var emma = {lat: 41.894798, lng: 12.4751301};
                    var first=emma;//{lat: coord[0].lat, lng: coord[0].lng};

                    var map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: first});
                    var first_marker=new google.maps.Marker({
                        position: first,
                        map:map,
                        animation: google.maps.Animation.DROP,
                        label: "A"});

                    var marker = [];
                    for(var i=0; i<tot; i++){
                       //marker[i]=new google.maps.Marker({position: coord[i].lat , lng: coord[i].lng, map:map});
                  }
                }
                  