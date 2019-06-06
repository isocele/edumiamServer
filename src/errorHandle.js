const requestPromise = require('request-promise');
var requestOptions = {};

module.exports = {

    initError: function(reqOpt) {
        requestOptions = reqOpt;
    },

    ageError: function(response) {
        console.log("402: Date of birth is invalid");
        requestPromise(requestOptions)
        .then(function() {
            response.json({
                status: 402,
                log: "Date of birth is invalid",
                "set_attributes": {
                    "validbirthdate": false
                },
                "messages": [
                    {"text": "Je suis désolé mais la date de naissance entrée ne semble pas être valide"}
                ]
            });
        });
    },

    dayError: function(response) {
        console.log("405: No data for this peticular day");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 405,
                    log: "No data for this peticular day"
                })
            });
    },

    requestError: function(response) {
        console.log("403: Error in the request");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 403,
                    log: "Error in the request"
                })

            });
    },

    emailError: function(response) {
        console.log("401: Email Invalid");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 401,
                    log: "Email invalid"
                })

            });
    }
};