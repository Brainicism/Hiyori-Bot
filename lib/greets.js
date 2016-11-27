const request = require('request');
const cron = require('node-cron');

const bot = require('./bot.js');

cron.schedule('47 23 * * *', function(){    // In UTC
    bot.sendMessage('1026469567461748', "Yo its suppose to be 7:45");
});

// function crontest(id)
// {
//     var task = cron.schedule('0 */2 * * *', function ()
//     {
//         var user_id = '1026469567461748';
//         var userInfoParams = {
//             url: 'https://graph.facebook.com/v2.6/' + user_id,
//             qs: {
//                 fields: 'first_name, timezone, profile_pic',
//                 access_token: process.env.FB_ACCESS_TOKEN
//             },
//             method: 'GET'
//         };
//
//         request(userInfoParams, function(error, response, body)
//         {
//             if (error)
//             {
//                 console.log ("Error retrieving user info: " + error);
//             }
//             else if (response.body.error)
//             {
//                 console.log ("Error: " + response.body.error);
//             }
//             else
//             {
//                 var user = JSON.parse(body);
//                 bot.sendMessage(user_id, "Hey " + user.first_name + user_id);
//             }
//         });
//     });
//
//     task.start();
// }

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
            bot.sendMessage(user_id, "Good morning " + user.first_name + '! ');
        }
    });
}

exports.getUserInfo = getUserInfo;
//exports.crontest = crontest;
