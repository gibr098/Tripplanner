
const express=require('express');
const app=express();
//app.use(bodyParser.urlencoded({ extended: false }));
const pathExists = require('path-exists');

const path = require('path')

const passport = require('passport')
const session = require('express-session')
const manageTokenOauth = require("./localTokenOauth");
const GoogleStrategy = require('passport-google-oauth20').Strategy

var request = require('request');

const dotenv = require("dotenv").config();

var bodyParser = require("body-parser");

var fs=require('fs');

const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('./swagger.json')

const PORT=9999;

var send=require('./send');
var receive=require('./receive');
const { fstat } = require('fs');

const open = require('open');
(async () => {
    await open('http://localhost:9999/');
})();

fs.writeFile('./cronologia.html', '<h1>CRONOLOGIA</h1>', function(err){
    if (err) return console.log(err);
})

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.get('/',function(req,res){
    const msg="<h3>Benvenuto, per iniziare vai su <a href='http://localhost:9999/start'>/start</a></h3><br>"+
    "<h3>Per la Documentazione <a href='http://localhost:9999/api-docs'>/api-docs</a></h3>";
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
            res.send(coord);
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

            var prova=[0,1,2,4];
            //coord.forEach((x,i) =>console.log('indice: ',i,x));
            //console.log(coord);

            send.invia(attrazioni);


            attrazioni+=`<!DOCTYPE html>
            <html>
              <head>
                <style>
                   /* Dimensioni del div che contiene la mappa */
                  #map {
                    height: 400px;  /* The height is 400 pixels */
                    width: 100%;  /* The width is the width of the web page */
                   }
                </style>
              </head>
              <body>
                <h3>Google Maps</h3>
                
                <div id="map"></div>

                <!--Load the API from the specified URL
                * The async attribute allows the browser to render the page while the API loads
                * The key parameter will contain your own API key (which is not needed for this tutorial)
                * The callback parameter executes the initMap() function
                -->

                <!--<script type="text/javascript" src="./app1.js"></script>-->

                <script>
                  function initMap() {
                //var emma = {lat: 41.894798, lng: 12.4751301};
                var first={lat: ${coord[0].lat}, lng: ${coord[0].lng}}
            
                var map = new google.maps.Map(document.getElementById('map'), {zoom: 12, center: first});
                //var m=new google.maps.Marker({position:first, map:map});

                //var prova= [0,1,2,3];

                var marker = [];

                for(var i=0;i<10;i++){
                    //marker[i]=new google.maps.Marker({position:{lat:41.8+i, lng:12.4+i}, map:map});
                }
                //{coord}.forEach((x,i) => new google.maps.Marker({position: {lat: x.lat, lng: x.lng} , map:map}));
              }
                </script>
                <script defer
                src="https://maps.googleapis.com/maps/api/js?key=`+process.env.GOOGLE_KEY+`&callback=initMap">
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

// Protocollo Oauth + funzione di logout
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
	done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
	done(null, user);
  });

//Impostiamo la GoogleStrategy per passport
passport.use(new GoogleStrategy( {
		clientID: "16094934261-dluj1rr4hktu5i2kbeltpf3nrp9sgnou.apps.googleusercontent.com",
		clientSecret: "qXU5la_iUOUBlfkSOPjq3Mfh",
		callbackURL: 'http://localhost:' + PORT + '/auth/google/callback',
		scope: ['email', 'https://www.googleapis.com/auth/calendar'],
	}, (accessToken, refreshToken, profile, cb) => {
		console.log('Our user authenticated with Google, and Google sent us back this profile info identifying the authenticated user:', profile);
		
		// Salviamo il token su un file chiamato currentToken
		// lo stesso file verrà distrutto al momento del logout
		manageTokenOauth.createToken("currentToken", accessToken);

		return cb(null, profile);
}));

// La sessione dell'utente viene creata, ma se NON viene creato un campo allora l'utente non viene salvato nel database
// questo facilita il controllo sui dati
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', session: true }), (req, res) => {
	console.log('we authenticated, here is our user object:', req.user);
	umail = req.user.emails[0].value;
	//res.send("Benarrivato <br> L'email dell'user è " + umail + req.isAuthenticated());
	res.sendFile(__dirname + "/" + "authcallback.html");
});
app.get('/home', function(req,res){
	res.sendFile(__dirname + "/" + "home.html");
})

app.get('/addeventnew', function(req,res){
	res.sendFile(__dirname + "/" + "addeventform.html");
})
app.get('/testauth', function(req,res){
	var auth= req.isAuthenticated();
	res.send("L'autenticazione è : " + auth);
})


app.get('/logout', function(req, res) {
	manageTokenOauth.deleteToken("currentToken");
	req.logout();
	res.sendFile(__dirname + "/" + "logout.html");
	
});
var calendar= require('./calendar');
app.use('/addevent',calendar);

var addeventform= require('./addeventform');
app.use('/addeventform',addeventform);

app.get('/existstoken', function(req,res){
	fs.stat('currentToken.txt', function(err, stat) {
		if(err == null) {
			console.log('File exists');
			res.sendFile(__dirname + "/" + "existstokentrue.html");
		} else if(err.code === 'ENOENT') {
			res.sendFile(__dirname + "/" + "existstokenfalse.html");
			console.log('File does not exists');

			// file does not exist
			//fs.writeFile('log.txt', 'Some log\n');
		} else {
			console.log('Some other error: ', err.code);
		}
	});
	
})


app.listen(PORT,function(){
    console.log("Server in ascolto sulla porta: %s",PORT);
    console.log("Ctrl+c per terminare");
});


