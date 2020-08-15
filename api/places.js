const dotenv=require('dotenv').config();

var request=require('request')

function getCityId(){
    return new Promise(function(resolve, reject){
        request({
            url:'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key='+process.env.GOOGLE_KEY +'&input='+req.params.citta+'&inputtype=textquery',
            method: 'GET',
        },function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                var info=JSON.parse(body);
                res.send(info);
                //res.send(info.data.style.description);
                //res.send(response.statusCode+" "+body)
                console.log(response.statusCode +" OK");
            }
        })
    })
}
