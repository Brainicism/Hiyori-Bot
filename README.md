# Hiyori-Bot
A messenger bot written in node.js with a variety of commands  
(With its main purpose for now to give you the weather for your city)

## *Requirements*

1. Create a Heroku account [here](https://www.heroku.com). We will use it to host our bot.

2. Create a Facebook developer account [here](https://developers.facebook.com/) and follow [this tutorial](https://github.com/jw84/messenger-bot-tutorial#setup-the-facebook-app) to set your bot up.

3. Get an OpenWeatherMap API from [here](http://openweathermap.org/api).

4. Set up your own environment variables  
(**WEATHERID** for OpenWeatherMap API, **FB_ACCESS_TOKEN** for your Facebook Page Access Token, and **VERIFY_TOKEN** for your personal verification message).

## *Setup*

1. In your local environment, run:

    ```
    npm install
    ```
    to install the required modules.

2. Afterwards, commit all of the code with git and create a new Heroku instance + push the code to cloud.

    ```
    git init
    git add .
    git commit -m 'hello world'
    heroku create
    git push heroku master
    ```

## *Commands*

### Main

* **Weather**: Returns the current weather of your city (If you gave your location).

* **Detailed Weather**: Returns a much more detailed weather of your city.

* **Forecast**: Returns the condition and highest/lowest temperature of the day.

* **Inspire**: Returns a random funny/inspiration quote.


### Misc

* **Help**: Returns a list of commands that the bot can do.

* **Setting**: Allows user to change the current notification/location.

* **Start Cron**: Starts the cronjob (A message at 8 every morning).

* **Stop Cron**: Stops the cronjob.


### Other Random Stuff

* **Random**: Returns the 3 classic random values (Head/Tail, Random num from 0-100, and a random letter).

* **Epoch**: Returns the current time in UNIX timestamp.

It will also respond if you say hi or bye!
