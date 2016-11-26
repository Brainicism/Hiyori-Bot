const request = require('request');

const bot = require('./bot.js');

function getUserInfo(user_id)
{
    var userInfoParams = {
        url: 'https://graph.facebook.com/v2.6/' + user_id,
        qs: {
            fields: 'first_name, timezone, profile_pic',
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
            bot.sendTextMessage(user_id, "Hey " + user.first_name + ", how are you");
        }
    });
}

exports.getUserName = getUserName;
