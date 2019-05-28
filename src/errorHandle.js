const requestPromise = require('request-promise');

module.exports = {

    ageError: function(requestOptions, response) {
        console.log(requestOptions);
        requestPromise(requestOptions)
        .then(function() {
            response.json({
                status: 402,
                log: "Date of birth is invalid"
            });
        });
    },

    dayError: function(requestOptions, response) {
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 405,
                    log: "No data for this peticular day"
                })

            });
    },

    requestError: function(requestOptions, response) {
        console.log(requestOptions);
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 403,
                    log: "Error in the request"
                })

            });
    },

    emailError: function(requestOptions, response) {
        console.log(requestOptions);
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    status: 401,
                    log: "Email invalid"
                })

            });
    }
};