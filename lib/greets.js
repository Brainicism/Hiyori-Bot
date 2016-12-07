const request = require('request');
const cron = require('node-cron');

const bot = require('./bot.js');
const weather = require('./weather.js');
const commands = require('./commands.js')


var cronTask;
var firstName, timeZone, profilePic;

function getStarted(msgEvent)
{
    var sender = msgEvent.sender.id;
    var payload = msgEvent.postback.payload;
    getUserInfo(sender);

    switch (payload)
    {
        case "GET_START":
            persistentMenu(sender);
            bot.sendMessage(sender, "Oh hello! I'm Hiyori and I will keep you updated on the weather :)");
            setTimeout(function() { bot.sendCronMessage(sender) }, 1000);
            break;
        case "CRON_YES":
            setTimeout(function() { setCron(sender) }, 3000);
            bot.sendMessage(sender, "Okay! I will greet you every morning at 8:00am! Use 'stop cron' if you need a break from me :(")
            break;
        case "CRON_NO":
            bot.sendMessage(sender, "Okay :( You can always use 'start cron' to have me greet you!")
            break;
        case "WEATHER":
            weather.getWeather(sender);
            break;
        case "FORECAST":
            // TODO Deal with this
            break;
        case "HELP":
            // TODO Deal with this
            break;
        case "SETTING":
            // TODO Deal with this
            break;
        default:
            bot.errorMsg(sender);
    }
}

// Fetching the user info
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

            firstName = user.first_name;
            timeZone = user.timezone;
            profilePic = user.profile_pic;
        }
    });
}

// Stops the cronjob
function stopCron(sender)
{
    cronTask.stop();
    bot.sendMessage(sender, "I will always be here for you... Use 'start cron' if you want me back :'(")
}

// Start the cronjob again
function startCron(sender)
{
    setCron(sender);
    bot.sendMessage(sender, "Hi " + firstName + "! It's good to be back :)");
}

// Fire off the user info for use
function sendUserInfo()
{
    return {
        'firstName': firstName,
        'profilePic': profilePic
    };
}

// Setting up the cron to send msg
function setCron(user_id)
{
    var hour = 8 - parseInt(timeZone);;
    var schedule = '0 ' + hour + ' * * *'

    cronTask = cron.schedule(schedule, function()
    {
        sendMorningMsg(user_id);
        getUserInfo(user_id);
    });
}

function sendMorningMsg(user_id)
{
    var date = new Date();
    var wd = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var calDate = date.toJSON().slice(0, 10);
    var weekDay = wd[date.getDay() - 1];

    var today = weekDay + ' ' + calDate.toString();
    var morningMsg = "Good morning " + firstName.toString() + '! \n It\'s ' + today + '. ';
    bot.sendMessage(user_id, morningMsg);
    setTimeout(function() { bot.sendMorningMessage(user_id) }, 1000);
}

function persistentMenu(sender)
{
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: {access_token: process.env.FB_ACCESS_TOKEN},
        method: 'POST',
        json:{
            setting_type : "call_to_actions",
            thread_state : "existing_thread",
            call_to_actions:[
                {
                    type:"postback",
                    title:"Current Weather",
                    payload:"WEATHER"
                },
                {
                    type:"postback",
                    title:"Forecast",
                    payload:"FORECAST"
                },
                {
                    type:"postback",
                    title:"Help",
                    payload:"HELP"
                },
                {
                    type:"postback",
                    title:"Setting",
                    payload:"SETTING"
              }
            ]
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}

// Greeting text before user 'Get Started'
request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: process.env.FB_ACCESS_TOKEN},
    method: 'POST',
    json: {
        setting_type: "greeting",
        greeting: {
            text: "Hi {{user_first_name}}. I will keep you updated on the weather"
                + " and provide you with some other functions! Click 'Get Started' and start talking to me :)"
        }
    }
}, function (error, res, body)
{
    if (error) {
        console.log('Error sending messages: ', error);
    } else if (res.body.error) {
        console.log('Error: ', res.body.error);
    }
});

exports.getStarted = getStarted;
exports.startCron = startCron;
exports.stopCron = stopCron;
exports.sendUserInfo = sendUserInfo;
