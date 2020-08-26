const express=require('express');
const app=express();
//app.use(bodyParser.urlencoded({ extended: false }));

var request = require('request');

const dotenv = require("dotenv").config();

var bodyParser = require("body-parser");

var fs=require('fs');

const PORT=5000;

var send=require('./send');
var receive=require('./receive');
const { fstat } = require('fs');



app.get('/',function(req,res){
    const msg="<h3>Benvenuto, per iniziare vai su <a href='http://localhost:5000/start'>/start</a></h3>"
    res.send(msg);
})

app.get('/start',function(req,res){
    res.sendFile('./form.html',{root:__dirname});
})

app.get('/info',function(req,res){
    res.sendfile("README.md");
})


app.get('/cronologia',function(req,res){
    receive.ricevi();
    res.sendFile('./cronologia.html',{root:__dirname});
})

app.get('/cancella-cronologia',function(req,res){
    fs.writeFile('./cronologia.html', '<h1>CRONOLOGIA</h1>', function(err){
        if (err) return console.log(err);
    })
    res.send('Cronologia Cancellata');
})

app.get('/attrazioni/:citta',function(req,res){
    request({
        url:'https://maps.googleapis.com/maps/api/place/textsearch/json?key='+process.env.GOOGLE_KEY+'&query=attrazioni+a+'+req.params.citta+'&language=it',
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            var attrazioni='<h1>Attrazioni:</h1><br>';
            for(var i=0; i<info.results.length; i++){
                attrazioni+='<h4>'+info.results[i].name+'</h4>'+' in '+info.results[i].formatted_address+'<br>';
            }
            res.send(attrazioni);
            //res.send(info);

            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
   }
    });
});

app.get('/pizzerie/:citta',function(req,res){
    request({
        url:'https://maps.googleapis.com/maps/api/place/textsearch/json?key='+process.env.GOOGLE_KEY+'&query=pizzerie+a+'+req.params.citta+'&language=it',
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            var coord=[];
            var pizzerie='<h1>Pizzerie:</h1><br>';
            var tot=info.results.length;

            for(var i=0; i<tot; i++){
                pizzerie+='<h4>'+info.results[i].name+'</h4>'+' in '+info.results[i].formatted_address+'<br>';
                coord[i]= {lat: info.results[i].geometry.location.lat, lng: info.results[i].geometry.location.lng};
            }

            pizzerie+=``;
      

            //res.send(pizzerie);
            res.send(info);
            //res.sendFile('./map1.html',{root:__dirname});

            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
   }
    });
});

app.get('/:luoghi/:citta',function(req,res){
    request({
        //url:'https://maps.googleapis.com/maps/api/place/textsearch/json?key='+process.env.GOOGLE_KEY+'&query='+req.params.luoghi+'a+'+req.params.citta+'&language=it',
        url:'https://maps.googleapis.com/maps/api/place/textsearch/json?key='+process.env.GOOGLE_KEY+'&query='+req.query.luoghi+'a+'+req.query.citta+'&language=it',
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            if(info.results.length==0){
                var errore="<h1> Nessun risultato ottenuto</h1>";
                res.send(errore);
            }
            else{
            var luogo=req.query.luoghi.toUpperCase();
            var citta=req.query.citta.toUpperCase();
            var coord=[];
            var tot=info.results.length;
            var attrazioni='<h1>'+ luogo +' a '+ citta +'</h1>';
            for(var i=0; i<tot; i++){
                coord[i]= {lat: info.results[i].geometry.location.lat, lng: info.results[i].geometry.location.lng};
                attrazioni+='<b>'+info.results[i].name+'</b>'+' in '+info.results[i].formatted_address+'</br>';
            }

            var j=0;

            send.invia(attrazioni);

            attrazioni+=`<!DOCTYPE html>
            <html>
              <head>
                <style>
                  /* Set the size of the div element that contains the map */
                  #map {
                    height: 400px;  /* The height is 400 pixels */
                    width: 100%;  /* The width is the width of the web page */
                   }
                </style>
              </head>
              <body>
                <h3>Google Maps</h3>
                <div id="map"></div>
                <script>
                function initMap() {
                    //var emma = {lat: 41.894798, lng: 12.4751301};
                    var first={lat: ${coord[0].lat}, lng: ${coord[0].lng}};

                    var map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: first});
                    
                    var marker = [];
                    for(var i=0;i<tot;i++){
                       //marker[i]=new google.maps.Marker({position: {lat: , lng:  , map:map});
                    }
                }
                </script>
                <script defer
                src="https://maps.googleapis.com/maps/api/js?key=`+process.env.GOOGLE_KEY+`+&callback=initMap">
                </script>
              </body>
            </html>`;

            

            //res.send(coord);
            res.send(attrazioni);
            //res.send(info);
            console.log(response.statusCode +" OK");
        }
    }
    });
});



app.listen(PORT,function(){
    console.log("Server in ascolto sulla porta: %s",PORT);
});

