const readline = require('readline');
const {google} = require('googleapis');
const request = require('request');
const express = require('express');
const router = express.Router();
const manageTokenOauth = require("./localTokenOauth");
const HTTP_OK = 200;
const APP_ID = "[TRIPLANNER]";
var fs=require('fs');
var bodyParser = require('body-parser');
const { TIMEOUT } = require('dns');
const { isNullOrUndefined } = require('util');
var url = require("url");
//per parsare la stringa dei parametri
var querystring = require('querystring');

//const { resolve } = require('app-root-path');
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//bottoni per ret
var delbutton =' <form action="http://localhost:9999/api/calendar/deleteeventview" method="post" name="delbut">Id Evento da cancellare: <input type="text" name="eventid" size="40" maxlength="40" required><br><input type="submit" value="Cancella"></form>';
var deleventreturn ='<br>Cosa vuoi fare? <form action="http://localhost:9999/api/calendar/geteventsview"><input type="submit" value="Mostra eventi programmati" /></form> <form action="http://localhost:9999/start"><input type="submit" value="Torna alla home" /></form>';
var backbutton = '<form action="http://localhost:9999/api/calendar/root"><input type="submit" value="Indietro" />';
var addeventbutton = '<form action="http://localhost:9999/api/calendar/addevent"><input type="submit" value="Aggiungi un nuovo evento" />';
//funzioni per la gestione degli eventi
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/notlogged");
    }
}


const gettoken = () =>{
return new Promise(function(resolve, reject) { 
            resolve( manageTokenOauth.readToken("currentToken"),setTimeout(function() {
            }, 5000) ); 
        
    
}); }

const arraytostring = (array) =>{
    return new Promise(function(resolve, reject) { 
            if(array.length==0){
                resolve ("Non ci sono eventi da mostrare" + backbutton);}
            else{
            resolve(array + delbutton + backbutton);
            }        
    }); }

    const arraytostringmod = (array) =>{
        return new Promise(function(resolve, reject) { 
                if(array.length==0){
                    resolve ("Non ci sono eventi da mostrare");}
                else{
                resolve(array);
                }        
        }); }

    const downloadevents = (accessToken) =>{
        return new Promise(function(resolve, reject) { 
    
            var options = {
                url:'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=9999&singleEvents=true',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
    
            request(options, (err, res, body) => {
                if (!err && res.statusCode == HTTP_OK) {
                    var info = JSON.parse(body);
                    l = info.items;
                    resolve( l ); 
                };
            });
                    
                
            
        }); }
const addevent = (accessToken,req, res,citta,tipo,posto, datainizio,datafine) =>{
        return new Promise(function(resolve, reject) { 
            var ret='200';
            var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };
    console.log(datainizio);

    var body = {
        'summary': 'TRIPLANNER',
        'description' : "Viaggio a " + citta + " Tipo Posto: " + tipo + " Locale da visitare: "+ posto,
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
            if(err) {console.log(err);
            ret='401';}
            else console.log("Aggiunto Evento");
        }
    );
resolve(ret);                
    }); }

const deleteevent = (accessToken, eventID) =>{
        return new Promise(function(resolve, reject) { 
            var ret = '200';
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
                    if(err) {console.log(err);
                    ret='401';}
                    else console.log("Evento Cancellato");
                }
                
            );
                resolve(ret);
                    
                
            
}); }

//routes 

router.post('/addeventview', function(req,res){
var citta=req.body.citta;
var tipo=req.body.tipo;
var posto= req.body.posto;
datainizio = req.body.start+"T09:00:00-07:00";
datafine = req.body.end + "T09:00:00-07:00";    
    gettoken().then((token)=>{
        console.log(token);
        
        return addevent(token, req, res,citta,tipo,posto, datainizio,datafine);
    })
    .then((ret)=>{
        console.log(ret);
        res.sendFile(__dirname + "/" + "eventadded.html");
    })
    .catch((err)=>{console.log('errore:', err)})
})

router.get('/addevent', function(req,res){
    res.sendFile(__dirname + "/" + "addevent.html");
})

router.get('/geteventsview', function(req,res){
        gettoken().then((token)=>{
        console.log(token);
        
        return downloadevents(token);
        
    }).then((l)=>{
        var array = new String();
        if(l!=null){
        for (var i = 0; i < l.length; i++) {
            if (l[i].summary.startsWith("TRIPLANNER"))
            {array+="<b>" + l[i].description+"</b>"+ "    Data Inizio: "+ l[i].start.dateTime + "    Data Fine: "+ l[i].end.dateTime+"    ID Evento "+l[i].id + "<br><br>" }
       
        };}
        return arraytostring(array);
    })
    .then((ret)=>{
        res.send(ret);
    })
    .catch((err)=> {
        console.log('errore : ' ,err );
    })
    
})

router.post('/deleteeventview', function(req,res){
    //deleteevent viene chiamata con un metodo post
    var eventID= req.body.eventid;
    gettoken().then((token)=>{
        return deleteevent(token,eventID);
    }).then((ret)=>{
        console.log(ret);
        res.send("Evento " + eventID +  " cancellato" + deleventreturn);
    })
    .catch((err)=>{
        console.log('errore: ' ,err);
    })
})

// servizi api
router.post('/addevents', function(req,res){
    var params = querystring.parse(url.parse(req.url).query);
    var citta=params["citta"];
    var tipo=params["tipo"];
    var posto= params["posto"];
    datainizio = params["start"]+"T09:00:00-07:00";
    datafine = params["end"] + "T09:00:00-07:00";    
    console.log(JSON.stringify(params));
        gettoken().then((token)=>{
            console.log(token);
            
            return addevent(token, req, res,citta,tipo,posto, datainizio,datafine);
        })
        .then((ret)=>{
            console.log(ret);
            res.send(ret);
        })
        .catch((err)=>{console.log('errore:', err)})
    })


router.get('/getevents', function(req,res){
    gettoken().then((token)=>{
    console.log(token);
    
    return downloadevents(token);
    
}).then((l)=>{
    var cont=0;
    var array = new Array();
    if(l!=null){
    for (var i = 0; i < l.length; i++) {
        if (l[i].summary.startsWith("TRIPLANNER"))
        {array[cont]=l[i];
        cont++; }
   
    };}
    return arraytostringmod(array);
})
.then((ret)=>{
    res.send(JSON.stringify(ret));
})
.catch((err)=> {
    console.log('errore : ' ,err );
})

})
router.post('/deleteevent', function(req,res){
    //deleteevent viene chiamata con un metodo post
    var params = querystring.parse(url.parse(req.url).query);
    var eventID= params["eventID"];
    gettoken().then((token)=>{
        return deleteevent(token,eventID);
    }).then((ret)=>{
        console.log(ret);
        res.send(ret);
    })
    .catch((err)=>{
        console.log('errore: ' ,err);
    })
})


router.get('/root', checkAuthentication, function(req,res){
    
    res.sendFile(__dirname + "/" + "calendar.html");

})



module.exports = router;