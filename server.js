//Server prova con express che si connette a un servizio che offre informazini sulle birre 

const express=require('express');
const app=express();
//app.use(bodyParser.urlencoded({ extended: false }));

var request = require('request');

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
        url:'https://sandbox-api.brewerydb.com/v2/beers?name='+nome+'&key=7852692d8bed34f98a272f59ffd375a8', //+process.env.BREW_KEY,
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
        url:'https://sandbox-api.brewerydb.com/v2/beer/random/?key=7852692d8bed34f98a272f59ffd375a8', //+process.env.BREW_KEY,
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

//const citta='rome';
app.get('/city_id/:citta',function(req,res){
    request({
        url:'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyCfoU_FqP-lC5nKYNR2qzNDynKs1TI3NuA&input='+req.params.citta+'&inputtype=textquery', //+process.env.BREW_KEY,
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

app.listen(PORT,function(){
    console.log("Server in ascolto sulla porta: %s",PORT);
});