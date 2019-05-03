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
    }

}