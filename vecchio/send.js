#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var prova=require('./server')

function invia(msg){
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'Queue';
        //var msg = 'Hello World!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log("Messaggio inviato");
    });
    setTimeout(function() {
        connection.close();
    }, 500);
});}

module.exports.invia=invia;

