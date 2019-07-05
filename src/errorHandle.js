const requestPromise = require('request-promise');
var requestOptions = {};

module.exports = {

    initError: function(reqOpt) {
        requestOptions = reqOpt;
    },

    ageError: function(response) {
        console.log("401: Date of birth is invalid");
        requestPromise(requestOptions)
        .then(function() {
            // response.status(401);
            response.json({
                Status: 401,
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
        console.log("204: No data for day " + ageDay);
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 204,
                    log: "No data for day " + ageDay
                })
            });
        // response.status(204).send({ error: 'Something failed!' });
        // res.status(500).send({ error: 'Something failed!' });
    },

    requestError: function(response, log) {
        console.log("401: Error in the request");
        // response.sendStatus(401);
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 401,
                    log: "Error in the request: " + log
                })

            });
    },

    emailError: function(response) {
        // response.sendStatus(401);
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
        console.log("204: No Favoris");
        // response.sendStatus(204);
        requestPromise(requestOptions)
            .then(function() {
                response.json({
                    status: 204,
                    log: "Aucun favoris",
                    "messages": [
                        {"text": "Tu n'as pas encore de Favori ! Pour en ajouter appuis sur les boutons Favoris présents sur certaines fiches."}
                    ]
                });
            });
    }
};
