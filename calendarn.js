const readline = require('readline');
const {google} = require('googleapis');
const request = require('request');
const express = require('express');
const router = express.Router();
const manageTokenOauth = require("./localTokenOauth");
const HTTP_OK = 200;
const APP_ID = '[NOMEAPP10]';
var fs=require('fs');
var bodyParser = require('body-parser');
const { TIMEOUT } = require('dns');
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var delbutton =' <form action="http://localhost:9999/api/calendar/deleteevent" method="post" name="delbut">Id Evento da cancellare: <input type="text" name="eventid" size="40" maxlength="40" required><br><input type="submit" value="Cancella"></form>';
var deleventreturn ='<br>Cosa vuoi fare? <form action="http://localhost:9999/api/calendar/getevents"><input type="submit" value="Mostra eventi programmati" /></form> <form action="http://localhost:9999/start"><input type="submit" value="Torna alla home" /></form>';

let scrivifile = async function (l) {

    try {
        setTimeout(function() {
        }, 5000);                             
           for (var i = 0; i < l.length; i++) {
            if (l[i].summary.startsWith(APP_ID))
            { console.log(l[i].summary,"---",l[i].description,l[i].start, l[i].end, l[i].id);
                
                fs.appendFile('./events.html', l[i].summary +" ---"+ l[i].description+"    Data Inizio: "+ l[i].start.dateTime + "    Data Fine: "+ l[i].end.dateTime+"    ID Evento "+l[i].id + "<br>" , function(err){
                if (err) return console.log(err);
            })
                
            }
        
        };
        return true;
    }
    catch (err) {
        //this is equivalent .catch statement
        console.log(err)
    }
};
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/notlogged");
    }
}

var citta="Roma";
var hotel="hotel 5 stelle";
var locale= "Ristorante";
datainizio = '2020-08-29T09:00:00-07:00';
datafine = '2020-08-29T17:00:00-07:00';
var token = manageTokenOauth.readToken("currentToken");

console.log(token);
let tokenfunction = async function () {

    try {
        // this will resolve the value 
        let data = await manageTokenOauth.readToken("currentToken");
        return data;
    }
    catch (err) {
        //this is equivalent .catch statement
        console.log(err)
    }
};
function aggiungiEvento(accessToken, req, res,citta,tipo,posto, datainizio,datafine) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    var body = {
        'summary': "[NOMEAPP10]",
        'description' : "Viaggio a " + citta + " Tipo Posto : " + tipo + " Locale da visitare :"+ posto,
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

function deleteEvent(accessToken,eventID) {
    var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events/'+eventID;
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    
    request( {
            headers: headers,
            url: url,
            method: 'DELETE',
        },
        function callback(err, res, body) {
            console.log(body);
            if(err) console.log(err);
            else console.log("Evento Cancellato");
        }
    );
}
    
let scaricaappendfunction = async function (accessToken) {

        try {
            // this will resolve the value 
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
                        });
                        
                        (async () => {
                            var test= await scrivifile(l);
                            // This will print the value of auth which will be passed from the aliasHasRole ie. True or False
                            console.log(test) //print value passed by function aliasHasRole...
                        })()

                        fs.appendFile('./events.html',"<br><br> Cancella un evento? <br> " + delbutton,function(err){
                            if (err) return console.log(err);
                        })
                    };
                };
            });
            return true;
        }
        catch (err) {
            //this is equivalent .catch statement
            console.log(err)
        }
    };
    


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
(async () => {
    var tok = await tokenfunction();
    // This will print the value of auth which will be passed from the aliasHasRole ie. True or False
    console.log(auth) //print value passed by function aliasHasRole...
    aggiungiEvento(tok, req, res,citta,tipo,posto, datainizio,datafine);
})()
   
    res.sendFile(__dirname + "/" + "eventadded.html");
    
})
router.get('/addevent', function(req,res){
    res.sendFile(__dirname + "/" + "addevent.html");
})

router.get('/getevents', function(req,res){
    (async () => {
        var tok = await tokenfunction();
        var test= scaricaappendfunction(tok);
        // This will print the value of auth which will be passed from the aliasHasRole ie. True or False
        console.log(test) //print value passed by function aliasHasRole...
    })()
    res.sendFile(__dirname + "/" + "events.html");
})

router.post('/deleteevent', function(req,res){
    //deleteevent viene chiamata con un metodo post
    var eventID= req.body.eventid;
    deleteEvent(token,eventID);
    //res.sendFile(__dirname + "/" + "eventdeleted.html");
    res.send("Evento " + eventID +  " cancellato" + deleventreturn);
    res.redirect('/api/calendar/getevents')
})

router.get('/root', checkAuthentication, function(req,res){
    
    res.sendFile(__dirname + "/" + "calendar.html");

})



module.exports = router;
