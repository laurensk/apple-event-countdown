var request = require('request');

var countDownDate = new Date("Oct 13, 2020 19:00:00").getTime();

setInterval(function () {

    var now = new Date().getTime();

    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance > 0 && minutes % 10 == 0 && seconds == 0) {
        console.log(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ");

        sendTweet(hours, minutes);
    }
}, 1000);

function sendTweet(hours, minutes) {
    var params = { value1: `The #AppleEvent starts in ${hours}h ${minutes}min...` };
    request.post({ url: 'https://maker.ifttt.com/trigger/send_tweet/with/key/cCbmHgWEBiorkIUon8kjru', qs: params });
}