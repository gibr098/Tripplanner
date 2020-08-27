const readline = require('readline');
const {google} = require('googleapis');
const request = require('request');
const express = require('express');
const router = express.Router();
const manageTokenOauth = require("./localTokenOauth");
var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



var homebutton = '<form action="http://localhost:9999/home"> <input type="submit" value="Torna alla home" /> </form>';

var token = manageTokenOauth.readToken("currentToken");
function aggiungiEvento(accessToken, req, res,citta,tipo,posto, datainizio,datafine) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    var body = {
        'summary': "Viaggio a " + citta,
        'description' : "Tipo posto : " + tipo + " Nome locale "+ posto,
        'start': {
            'dateTime': datainizio,
        },
        'end': {
            'dateTime': datafine,
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
router.post('/', function(req,res){
    //aggiungiEvento(token, req, res,citta,posto,locale, datainizio,datafine);
    //res.sendFile(__dirname + "/" + "addevent.html");
    
var citta=req.body.citta;
var tipo=req.body.tipo;
var posto= req.body.posto;
datainizio = req.body.start+"T09:00:00-07:00";
datafine = req.body.end + "T09:00:00-07:00";
aggiungiEvento(token, req, res,citta,tipo,posto, datainizio,datafine);
res.send("Aggiunto viaggio a " + citta+" "+  tipo +" "+ posto + " DataInizio : " +datainizio+ " Datafine: "+ datafine +"<br>"+ homebutton);
});

module.exports = router;