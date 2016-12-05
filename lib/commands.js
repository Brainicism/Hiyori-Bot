const greets = require('./greets.js');
const bot = require('./bot.js');

function getEpoch(sender, timestamp)
{
    timestamp = Math.floor(timestamp / 1000);
    bot.sendMessage(sender, timestamp.toString());
}

function getRandom(sender)
{
    var headTail = Math.floor(Math.random() * 2) ? "Head" : "Tail";
    var randNum = Math.floor(Math.random() * 100);
    var randLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);

    bot.sendMessage(sender, headTail + ' ' + randNum + ' ' + randLetter.toUpperCase());
}

function getAwesome(sender)
{
    userInfo = greets.sendUserInfo();
    bot.sendMesage(sender, userInfo.profilePic);
}

exports.getEpoch = getEpoch;
exports.getRandom = getRandom;
exports.getAwesome = getAwesome;
