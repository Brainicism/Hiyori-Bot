const request = require('request');

function kelvinToCelsius(tempK)
{
    return (tempK - 273.15);
}

function getWeather(user_id)
{
    var weatherParam = {
        url: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
            q: 'toronto',
            appid: process.env.WEATHERID
        },
        method: 'GET'
    };

    request(weatherParam, function(error, response)
    {
        if (error)
        {
            console.log ("Error retrieving weather data: " + error);
        }
        else
        {
            var res = JSON.parse(response.body);
            var main = res.main;

            var temp = kelvinToCelsius(main.temp).toFixed(2) + '°C';
        }
    });
}
