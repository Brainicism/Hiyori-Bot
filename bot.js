/*
Almost all of the code in this file is taken from:
https://github.com/jw84/messenger-bot-tutorial
I used it to help me set up my messenger bot
*/

'use strict'

const token = process.env.FB_ACCESS_TOKEN;

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const greets = require('./lib/greets.js');

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
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++)
    {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;
        if (event.message && event.message.text)
        {
            greets.getUserInfo(sender);
        }
    }

    res.sendStatus(200);
})

function sendTextMessage(sender, text)
{
    let messageData = {text: text};
    var reqParams = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    };

    request(reqParams, function(error, response, body)
    {
        if (error)
        {
            console.log('Error sending messages: ', error);
        }
        else if (response.body.error)
        {
            console.log('Error: ', response.body.error);
        }
    });
}