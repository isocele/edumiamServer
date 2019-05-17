const requestPromise = require('request-promise');

module.exports = {

    ageError: function(requestOptions, response) {
        requestPromise(requestOptions)
        .then(function(data) {
            response.json({
                success: false,
                error: 402,
                log: "Date of birth is invalid"
            });
        });
    },

    dayError: function(requestOptions, response) {
        console.log("oui");
        requestPromise(requestOptions)
            .then(function () {
                response.json({
                    success: "false",
                    error: "405",
                    log: "No data for this peticular day"
                })

            });
    }

}