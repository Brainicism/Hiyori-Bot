const request = require('request');

const weather = require('./weather');


function performCommands(msgObj)
{
    var msg = msgObj.message.text;
    var attachment = msgObj.message.attachments;
    var sender = msgObj.sender.id;

    if (msg)
    {
        msg = msg.toLowerCase();

        switch(msg)
        {
            case "hi":
                sendMessage(sender, 'Hey!');
                break;
            case "epoch":
                getEpoch(sender, msgObj.timestamp);
                break;
            case "random":
                getRandom(sender);
                break;
            case "weather":
                weather.getWeather(sender);
                break;
            case "detailed weather":
                weather.getDetail(sender);
                break;
            default:
                sendMessage(sender, "This is a message");
        }
    }
    else if (attachment)
    {
        sendMessage(sender, "That's an attachment");
    }
}

function getEpoch(sender, timestamp)
{
    timestamp = Math.floor(timestamp / 1000);
    sendMessage(sender, timestamp.toString());
}

function getRandom(sender)
{
    var headTail = Math.floor(Math.random() * 2) ? "Head" : "Tail";
    var randNum = Math.floor(Math.random() * 100);
    var randLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);

    sendMessage(sender, headTail + ' ' + randNum + ' ' + randLetter.toUpperCase());
}

function errorMsg(sender)
{
    sendMessage(sender, "I couldn't understand the input, please give a valid command");
}

function sendMessage(sender, text)
{
    var messageData = {
        text: text
    };

    var reqParams = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.FB_ACCESS_TOKEN
        },
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

exports.errorMsg = errorMsg;
exports.sendMessage = sendMessage;
exports.performCommands = performCommands;
