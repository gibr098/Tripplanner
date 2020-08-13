const express = require('express');
const router = express.Router();
//per leggere la url della pagina
var url = require("url");
//per parsare la stringa dei parametri
var querystring = require('querystring');


router.get("/", function(req,res) {
//res.send("Sei nel send di passaparametri" + "<br>"+ "E vieni da: " + url.parse(req.url).pathname);
var params = querystring.parse(url.parse(req.url).query);

var cittainserita = params["citta"];
res.send("Parametri: <br>" + cittainserita);
})

module.exports = router;