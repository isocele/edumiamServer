const requestPromise = require('request-promise');

module.exports = {

    ageError: function(requestOptions, response) {
        console.log("402: Date of birth is invalid");
        requestPromise(requestOptions)
        .then(function() {
            response.json({
                status: 402,
                log: "Date of birth is invalid"
            });
        });
    },

    dayError: function(requestOptions, response) {
        console.log("405: No data for this peticular day");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 405,
                    log: "No data for this peticular day"
                })

            });
    },

    requestError: function(requestOptions, response) {
        console.log("403: Error in the request");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 403,
                    log: "Error in the request"
                })

            });
    },

    emailError: function(requestOptions, response) {
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