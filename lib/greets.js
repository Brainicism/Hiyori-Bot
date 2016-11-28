const request = require('request');
const cron = require('node-cron');

const bot = require('./bot.js');
const weather = require('./weather.js');


var greetings = function()
{
    var firstName, timeZone, profilePic;

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

                firstName = body.first_name;
                timeZone = body.timezone;
                profilePic = body.profilePic;
            }
        });
    }

    function setCron(user_id)
    {
        var hour = parseInt(timeZone) + 7;
        var schedule = '45 ' + hour + ' * * *'

        cron.schedule(schedule, function() {    // Scheduled at 7:45am

        });
    }

    function sendMorningMsg(user_id)
    {
        var date = new Date();
        var wd = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var calDate = date.toJSON().slice(0, 10);
        var weekDay = wd[date.getDay()];

        var today = weekDay + ' ' + calDate.toString();
        var morningMsg = "Good morning " + firstName.toString() '! It\'s ' + today + '. ';
        bot.sendMessage(user_id, morningMsg);
    }

    this.greet = function(user_id)
    {
        getUserInfo(user_id);
    }
}

module.export = greetings;
