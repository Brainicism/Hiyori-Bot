const request = require('request');

function getUserInfo(user_id)
{
    var userInfoParams = {
        url: 'https://graph.facebook.com/v2.6/' + user_id + '?fields=first_name,profile_pic,timezone&',
        qs: {
            access_token: process.env.FB_ACCESS_TOKEN
        },
        method: 'GET'
    };

    request(userInfoParams, function(error, response, body)
    {
        if (error)
        {
            console.log ("Error retrieving user info: " + error);
        }
        else if (response.body.error)
        {
            console.log ("Error: " + response.body.error);
        }
        else
        {
            var user = JSON.parse(body);
            sendTextMessage(user_id, "Hey " + user.first_name + ", how are you");
        }
    });
}

function sendTextMessage(sender, text)
{
    let messageData = {text: text};
    var reqParams = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.FB_ACCESS_TOKEN},
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

exports.getUserName = getUserName;
