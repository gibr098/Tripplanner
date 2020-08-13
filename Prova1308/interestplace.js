const express = require('express');
const router = express.Router();
var request = require('request');
var apigoogle = "AIzaSyCfoU_FqP-lC5nKYNR2qzNDynKs1TI3NuA";
function richiestaplaces(){
    var citta="Roma";
//var reqsring= "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"+apigoogle+"&"+ citta+ "&textquery";
var reqsring = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=apigoogle";
var info= request(reqsring); 
console.log(info);
}

router.get("/", function(req,res) {
res.send("Restituito nella console");
richiestaplaces();
})

module.exports = router;