const request = require('request');
const geocoder = require('geocoder');

const bot = require('./bot.js');

var city, country, location;

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

function getLocation(sender, coordinates)
{
    console.log(coordinates.lat);
    var lat = coordinates.lat;
    var lon = coordinates.long;

    geocoder.reverseGeocode(lat, lon, function (err, data) {
        if (err)
        {
            console.log(err);
        }
        else
        {
            data.results[0].address_components.forEach(function(obj)
            {
                if (obj.types[0] === 'locality')
                {
                  city = obj.short_name;
                }
                if (obj.types[0] === 'country')
                {
                  country = obj.short_name;
                }
            });

            location = city + ',' + country;
        }
    });
}

function getWeather(user_id)
{
    var weatherParam = {
        url: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
            q: location,
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

            var msg = 'Currently in ' + city + ': \n'
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
            q: location,
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

exports.getLocation = getLocation;
exports.getWeather = getWeather;
exports.getDetail = getDetail;
