const fs = require('fs')

const greets = require('./greets.js');
const bot = require('./bot.js');

var quotes;
fs.readFile('misc/quotes.json', function(err, data)
{
    if (err) {
        console.log(err);
    }
    else {
        quotes = JSON.parse(data);
    }
});


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
    bot.sendMessage(sender, userInfo.profilePic);
}

function getInspire(sender)
{
    var rand = Math.floor(Math.random() * quotes.length);
    bot.sendMessage(sender, quotes[rand]);
}

exports.getEpoch = getEpoch;
exports.getRandom = getRandom;
exports.getAwesome = getAwesome;
exports.getInspire = getInspire;
