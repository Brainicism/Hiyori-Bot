const request = require('request');

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
            default:
                sendMessage(sender, "This is a message");
        }
    }
    else if (attachment)
    {
        sendMessage(sender, "That's an attachment");
    }
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

exports.sendMessage = sendMessage;
exports.performCommands = performCommands;
