#!/usr/bin/env node
//Principale
require('dotenv').config()
const pathExists = require('path-exists');
const fs = require('fs');
const path = require('path')
const express = require('express')
const request = require('request')
const passport = require('passport')
const bodyparser = require('body-parser')
const session = require('express-session')
const manageTokenOauth = require("./localTokenOauth");
const GoogleStrategy = require('passport-google-oauth20').Strategy


const app = express();
const PORT = 9999;


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
app.get('/', function(req,res){
	res.sendFile(__dirname + "/" + "home.html");
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


// Avvio del server
var server = app.listen(PORT, function () {
	console.log('[i] Provaapp su http://localhost:%s', PORT);
	console.log("[+] Premere ctrl+c per terminare");

});