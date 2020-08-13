 //imports
 const express = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');
//inizializzazione server
//inizializzazione server
const app = express();
app.use(bodyParser.json());

app.get("/", function(req,res){
    res.send("Root");
})
var cit = "Rome";
const interestplaces = require("./interestplace");
app.use("/iplace",interestplaces);
const parametri = require("./passaparametri");
app.use("/param",parametri);






const port = process.env.PORT || 9999;
app.listen(port);
console.log("Listening on port " + port);