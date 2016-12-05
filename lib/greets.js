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
            bot.sendMessage(sender, "Oh hello! I'm Hiyori and I will keep you updated on the weather :)");
            bot.sendCronMessage(sender);
            break;
        case "CRON_YES":
            setTimeout(function() { setCron(sender) }, 3000);
            bot.sendMessage(sender, "Okay! I will greet you every morning at 8:00am! Use 'stop cron' if you don't want me anymore :(")
            break;
        case "CRON_NO":
            bot.sendMessage(sender, "Okay :( You can always use 'start cron' to have me greet you!")
            break;
        case "WEATHER":
            weather.getWeather(sender);
            break;
        case "DETAILED_WEATHER":
            weather.getDetail(sender);
            break;
        case "MOTIVATION":
            // TODO Get this going
            break;
        case "AWESOME":
            commands.getAwesome(sender);
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
            profilePic = user.profilePic;
        }
    });
}

// Stops the cronjob
function stopCron(sender)
{
    cronTask.stop();
    bot.sendMessage(sender, "I will always be here for you... Use 'start cron' if you want me back :'('")
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
        'firstName': first_name,
        'profilePic': profilePic
    };
}

// Setting up the cron to send msg
function setCron(user_id)
{
    var hour = 8 - parseInt(timeZone);
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
    bot.sendMorningMessage(user_id);
}

exports.getStarted = getStarted;
exports.startCron = startCron;
exports.stopCron = stopCron;
exports.sendUserInfo = sendUserInfo;
