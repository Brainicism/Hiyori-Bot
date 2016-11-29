const request = require('request');

const bot = require('./bot.js');


function kelvinToCelsius(tempK)
{
    return (tempK - 273.15);
}

function getWeather(user_id, location)
{
    var loc = location.split(/[ ,]+/);

    var weatherParam = {
        url: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
            q: loc.toString(),
            appid: process.env.WEATHERID
        },
        method: 'GET'
    };

    request(weatherParam, function(error, response)
    {
        if (error)
        {
            console.log ("Error retrieving weather data: " + error);
            bot.errorMsg(user_id);
        }
        else
        {
            var res = JSON.parse(response.body);
            var conditon = res.weather[0].description;
            var temp = kelvinToCelsius(res.main.temp).toFixed(2) + '°C';

            var msg = 'Currently in ' + loc.toString() + ': \n'
                    + 'It is ' + temp + ' with ' + condition;

            bot.sendMessage(user_id, msg);
        }
    });
}

function getDetail()
{

}

export.getWeather = getWeather;
export.getDetail = getDetail;
