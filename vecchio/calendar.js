const readline = require('readline');
const {google} = require('googleapis');
const request = require('request');
const express = require('express');
const router = express.Router();
const manageTokenOauth = require("./localTokenOauth");


var citta="Roma";
var hotel="hotel 5 stelle";
var locale= "Ristorante";
datainizio = '2020-08-29T09:00:00-07:00';
datafine = '2020-08-29T17:00:00-07:00';
var token = manageTokenOauth.readToken("currentToken");
function aggiungiEvento(accessToken, req, res,citta,hotel,locale, datainizio,datafine) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    var body = {
        'summary': "[Viaggio Nomeapp]",
        'description' : "Viaggio a " + citta + "Soggiorno in hotel : " + hotel + "Locale da visitare"+ locale,
        'start': {
            'dateTime': '2020-08-29T09:00:00-07:00',
        },
        'end': {
            'dateTime': '2020-08-29T17:00:00-07:00',
        },
        'visibility': 'public'
    };

    request( {
            headers: headers,
            url: url,
            method: 'POST',
            body: JSON.stringify(body)
        },
        function callback(err, res, body) {
            console.log(body);
            if(err) console.log(err);
            else console.log("Aggiunto Evento:");
        }
    );
}
router.get('/', function(req,res){
    aggiungiEvento(token, req, res,citta,hotel,locale, datainizio,datafine);
    res.sendFile(__dirname + "/" + "addevent.html");
})

module.exports = router;