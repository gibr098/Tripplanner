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
                resolve ("Non ci sono eventi da mostrare" + backbutton);
                console.log("Sono qui");}
            else{
                console.log("Adesso sono qui");
            resolve(JSON.stringify(array) + delbutton + backbutton);
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
                    if (l != null) {
                        console.log("Trovati eventi in l");
                        fs.writeFile('./events.html', 'Eventi programmati <br>', function(err){
                            if (err) return console.log(err);
                        })
                   
                    }
        
                    if(l==null) { 
                        console.log("l è vuoto non ci sono eventi");
                        fs.writeFile('./events.html', 'Non ci sono eventi da mostrare', function(err){
                            if (err) return console.log(err);
                        })
                    }
                    resolve( l ); 
                };
            });
                    
                
            
        }); }
const addevent = (accessToken,req, res,citta,tipo,posto, datainizio,datafine) =>{
        return new Promise(function(resolve, reject) { 
            var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    var headers = {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    };

    var body = {
        'summary': 'TRIPLANNER',
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
resolve('OK');                
    }); }

const deleteevent = (accessToken, eventID) =>{
        return new Promise(function(resolve, reject) { 
            var ret = 'OK';
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
            {array+=l[i].description+"    Data Inizio: "+ l[i].start.dateTime + "    Data Fine: "+ l[i].end.dateTime+"    ID Evento "+l[i].id + "<br><br>" }
       
        };}
        return arraytostring(array);
        //res.send(JSON.stringify(array) + delbutton +'<br><br>Cosa vuoi fare?<br>' +  backbutton + addeventbutton);
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
router.post('/addevent', function(req,res){
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
            res.send(ret);
        })
        .catch((err)=>{console.log('errore:', err)})
    })

router.get('/getevents', function(req,res){
        gettoken().then((token)=>{
        console.log(token);
        
        return downloadevents(token);
        
    }).then((l)=>{
        var array = new String();
        if(l!=null){
        for (var i = 0; i < l.length; i++) {
            if (l[i].summary.startsWith("TRIPLANNER"))
            {array+=l[i];}
        
        };}
        res.send(JSON.stringify(array));
    })
    .catch((err)=> {
        console.log('errore : ' ,err );
    })
    
})
router.post('/deleteevent', function(req,res){
    //deleteevent viene chiamata con un metodo post
    var eventID= req.body.eventid;
    gettoken().then((token)=>{
        return deleteevent(token,eventID);
    }).then((ret)=>{
        console.log(ret);
        res.send("ret");
    })
    .catch((err)=>{
        console.log('errore: ' ,err);
    })
})


router.get('/root', checkAuthentication, function(req,res){
    
    res.sendFile(__dirname + "/" + "calendar.html");

})



module.exports = router;