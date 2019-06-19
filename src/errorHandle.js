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

    dayError: function(response, ageDay) {
        console.log("405: No data for day " + ageDay);
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 405,
                    log: "No data for day " + ageDay
                })
            });
    },

    requestError: function(response, log) {
        console.log("403: Error in the request");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 403,
                    log: "Error in the request: " + log
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
    },

    favorisError: function(response) {
        console.log("407: Aucun Favoris");
        requestPromise(requestOptions)
            .then(function() {
                response.json({
                    status: 407,
                    log: "Aucun favoris",
                    "messages": [
                        {"text": "Tu n'as pas encore de Favori ! Pour en ajouter appuis sur les boutons Favoris présents sur certaines fiches."}
                    ]
                });
            });
    }
};
