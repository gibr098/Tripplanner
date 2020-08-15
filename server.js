//Server prova con express che si connette a un servizio che offre informazini sulle birre 

const express=require('express');
const app=express();
//app.use(bodyParser.urlencoded({ extended: false }));

var request = require('request');

const dotenv = require("dotenv").config();

var bodyParser = require("body-parser");

const PORT=5000;

app.get('/',function(req,res){
    res.send("Benvenuto");
})

app.get('/info',function(req,res){
    res.sendfile("README.md");
})


const nome='happy ending';
app.get('/beer/happyending',function(req,res){
    request({
        url:'https://sandbox-api.brewerydb.com/v2/beers?name='+nome+'&key='+process.env.BREW_KEY,
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            res.send(info);
            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
        }
    });
});

app.get('/beer',function(req,res){
    request({
        url:'https://sandbox-api.brewerydb.com/v2/beer/random/?key='+ process.env.BREW_KEY,
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            res.send(info);
            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
        }
    });
});

var id;app.get('/city_id/:citta',function(req,res){
    request({
        url:'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key='+process.env.GOOGLE_KEY +'&input='+req.params.citta+'&inputtype=textquery',
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            res.send(info.candidates);
            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
   }
    });
});

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


app.get('/ristoranti/',function(req,res){
    request({
        url:'https://maps.googleapis.com/maps/api/place/textsearch/json?key='+process.env.GOOGLE_KEY+'&query=ristoranti+a+'+req.query.citta+'&language=it',
        method: 'GET',
    },function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            var info=JSON.parse(body);
            var ristoranti='<h1>Ristoranti:</h1><br>';
            for(var i=0; i<info.results.length; i++){
                ristoranti+='<h4>'+info.results[i].name+'</h4>'+' in '+info.results[i].formatted_address+'<br>';
            }
            res.send(ristoranti);
            //res.send(info);

            //res.send(info.data.style.description);
            //res.send(response.statusCode+" "+body)
            console.log(response.statusCode +" OK");
   }
    });
});



app.listen(PORT,function(){
    console.log("Server in ascolto sulla porta: %s",PORT);
});