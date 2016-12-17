/*
Most of the code in this file is taken from:
https://github.com/jw84/messenger-bot-tutorial
I used it to help me set up my messenger bot

Mainly server setup stuff here
*/

'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const bot = require('./lib/bot.js');

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res)
{
    res.send('Hello world, I am a messenger bot');
});

// for Facebook verification
app.get('/webhook/', function (req, res)
{
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN)
    {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

// Spin up the server
app.listen(app.get('port'), function()
{
    console.log('running on port', app.get('port'));
});

app.post('/webhook/', function (req, res)
{
    var data = req.body;

    data.entry.forEach(function(msgEntry)
    {
        msgEntry.messaging.forEach(function(msgEvent)
        {
            bot.userMsg(msgEvent)
        });
    });

    res.sendStatus(200);
});
