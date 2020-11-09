var schedule = require('node-schedule');
var Twitter = require('twitter');
require('dotenv').config()

const appleEventStartDate = new Date("Nov 10, 2020 19:00:00").getTime();

let sentFinalTweet = false;

(function main() {
    setupTwitter((client) => {
        registerScheduleHandler(client);
    })
})();

function setupTwitter(callback) {
    var client = new Twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });
    callback(client);
}

function registerScheduleHandler(client) {
    initStart();
    schedule.scheduleJob('* * * * *', function () {
        const currentDate = new Date().getTime();
        processTweetAction(currentDate, client);
    });
    initDone();
}

function processTweetAction(currentDate, client) {
    const distance = appleEventStartDate - currentDate;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    if (currentDate > appleEventStartDate && !sentFinalTweet) {
        sentFinalTweet = true;
        return startsNow(hours, minutes, client);
    } else if (distance > 0 && hours == 0 && minutes <= 15) {
        return last15minutesBefore(hours, minutes, client);
    } else if (distance > 0 && hours == 0 && minutes <= 60) {
        return lastHourBefore(hours, minutes, client);
    } else if (distance > 0 && hours <= 9 && minutes == 0) {
        return lastHoursBefore(hours, minutes, client);
    } else if (distance > 0 && hours >= 1 && minutes == 0) {
        return hoursBefore(hours, minutes, client);
    }
}

function hoursBefore(hours, minutes, client) {
    const tweet = `The #AppleEvent starts in ${hours}h ${minutes}min...`;
    sendTweet(client, tweet);
}

function lastHoursBefore(hours, minutes, client) {
    const tweet = `The #AppleEvent starts in ${hours}h ${minutes}min...`;
    sendTweet(client, tweet);
}

function lastHourBefore(hours, minutes, client) {
    const tweet = `The #AppleEvent starts in ${minutes}min...`;
    sendTweet(client, tweet);
}

function last15minutesBefore(hours, minutes, client) {
    const tweet = `The #AppleEvent starts in ${minutes}min...`;
    sendTweet(client, tweet);
}

function startsNow(hours, minutes, client) {
    const tweet = `The #AppleEvent starts now! Enjoy the event!`;
    sendTweet(client, tweet);
}

function sendTweet(client, tweet) {
    client.post('statuses/update', { status: tweet }, function (error, tweet, response) {
        if (error) console.log(new Date().toDateString() + ': Tweet failed...');
        if (!error) console.log(new Date().toDateString() + ': Tweet sent successfully...');
    });
}

function initStart() {
    console.log('Starting apple-event-countdown...');
}

function initDone() {
    console.log('Successfully started apple-event-countdown.');
}