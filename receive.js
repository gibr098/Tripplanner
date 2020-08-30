#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var fs=require('fs');
var db=require('./database')
var session_id=Math.random();

function ricevi(){
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'Queue';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" Attendo Messaggio", queue);

        channel.consume(queue, function(msg) {
            ris=msg.content.toString();
            console.log("Messaggio ricevuto");
            /*
            fs.appendFile('./cronologia.html', ris, function(err){
                if (err) return console.log(err);
            })
            */
           db.salva(session_id,ris)

        }, {
            noAck: true
        });
    });
});

}

module.exports.ricevi=ricevi;
module.exports.session_id=session_id;