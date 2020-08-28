const readline = require('readline');
const {google} = require('googleapis');
const request = require('request');
const express = require('express');
const router = express.Router();
const manageTokenOauth = require("./localTokenOauth");
const HTTP_OK = 200;
const APP_ID = '[NOMEAPP10]';
var fs=require('fs');
var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var citta="Roma";
var hotel="hotel 5 stelle";
var locale= "Ristorante";
datainizio = '2020-08-29T09:00:00-07:00';
datafine = '2020-08-29T17:00:00-07:00';
var token = manageTokenOauth.readToken("currentToken");
console.log(token);
function aggiungiEvento(accessToken, req, res,citta,tipo,posto, datainizio,datafine) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    var body = {
        'summary': "[NOMEAPP10]",
        'description' : "Viaggio a " + citta + "Tipo Posto : " + tipo + "Locale da visitare"+ posto,
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
            else console.log("Aggiunto Evento");
        }
    );
}
function scaricaEventi(accessToken) {
    var options = {
        url:'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=9999&singleEvents=true',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    request(options, (err, res, body) => {
        if (!err && res.statusCode == HTTP_OK) {
            var info = JSON.parse(body);
            var l = info.items;
            var k=0;
            var events= new Array();

            if (l != null) {
                fs.writeFile('./events.html', '', function(err){
                    if (err) return console.log(err);
                })
                for (var i = 0; i < l.length; i++) {
                    if (l[i].summary.startsWith(APP_ID))
                    { console.log(typeof(l[i]));
                        fs.appendFile('./events.html', JSON.stringify(l[i]) , function(err){
                        if (err) return console.log(err);
                    })
                        
                    }
                };
                
            };
        };
    });
} 

router.get('/addeventdefault', function(req,res){
    aggiungiEvento(token, req, res,"Roma","Ristorante","I due Bar", datainizio,datafine);
    res.sendFile(__dirname + "/" + "defaulteventadded.html");
})

router.post('/addevent', function(req,res){
var citta=req.body.citta;
var tipo=req.body.tipo;
var posto= req.body.posto;
datainizio = req.body.start+"T09:00:00-07:00";
datafine = req.body.end + "T09:00:00-07:00";
    aggiungiEvento(token, req, res,citta,tipo,posto, datainizio,datafine);
    res.sendFile(__dirname + "/" + "eventadded.html");
    
})
router.get('/addevent', function(req,res){
    res.sendFile(__dirname + "/" + "addevent.html");
})

router.get('/getevents', function(req,res){
    scaricaEventi(token);
    res.sendFile(__dirname + "/" + "events.html");
})

router.get('/root', function(req,res){
    
    res.sendFile(__dirname + "/" + "calendar.html");

})



module.exports = router;