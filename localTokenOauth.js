// Modulo per costruire il percorso a partire dalla 
// base directory del progetto (dove è app.js)
//file dove si gestisce cosa fare con i token...
var baseDir = require('app-root-path');
console.log(baseDir);

const fs = require('fs');
const tokenfilename="currentToken";

// Salvo il token dell'utente su un file nominato come la sua email
// lo stesso file verrà distrutto al momento del logout
module.exports.createToken = function (tokenfilename, accessToken) {
    
    var fname = __dirname + "/" + tokenfilename + ".txt";
    console.log(fname);
    console.log("Token: " + accessToken);
    fs.writeFile(fname, accessToken, function (err) {
        if (err) return console.log(err);
        console.log('Token correttamente salvato');
    });
}

module.exports.readToken = function (tokenfilename) {
    var fname = __dirname + "/" + tokenfilename + ".txt";
    try{
    var token = fs.readFileSync(fname, {encoding: 'utf8', flag: 'r'});
    }
    catch(err){
        console.log("Login non effettuato");
    }
    return token;
    
}

// Distruttore del file
module.exports.deleteToken = function (tokenfilename) {
    var fname = __dirname +"/" + tokenfilename + ".txt";
    try {
        fs.unlinkSync(fname);
    }
    catch(err) {
        console.error(err);
    }
}