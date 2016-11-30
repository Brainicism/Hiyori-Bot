const request = require('request');

const bot = require('./bot.js');


function kelvinToCelsius(tempK)
{
    return (tempK - 273.15);
}

function windDirection(degrees)
{
    var dir;

    switch(degrees)
    {
        case 0:
        case 360:
            dir = 'N';
            break;
        case 90:
            dir = 'E';
            break;
        case 180:
            dir = 'S';
            break;
        case 270:
            dir = 'W';
            break;
    }

    if (!dir)
    {
        if (degrees < 90)
        {
            dir = 'NE';
        }
        else if (degrees > 90 && degrees < 180)
        {
            dir = 'SE';
        }
        else if (degrees > 180 && degrees < 270)
        {
            dir = 'SW';
        }
        else if (degrees > 270 && degrees < 360)
        {
            dir = 'NW';
        }
    }

    return dir;
}

function getWeather(user_id)
{

    if (firstTime)
    {
        firstTime = false;
        getLocation();
    }
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

function getDetail(user_id)
{
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

            var msg = 'Currently in ' + res.name + ', ' + res.sys.country + ': \n'
                    + 'Condition: ' + condition + ' & ' + temp + '\n'
                    + 'Humidity: ' + res.main.humidity + '% &' + ' Pressure: ' + res.main.pressure + 'hPa \n'
                    + 'Wind Speed: ' + res.wind.speed + 'km/h' + windDirection(deg) + '\n';

            bot.sendMessage(user_id, msg);
        }
    });
}

export.getWeather = getWeather;
export.getDetail = getDetail;
