const requestPromise = require('request-promise');

const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
const postemail = "contact@edumiam.com";
const endpoint = "contacts/v1/contact";

var properties = [];

function createProperties(req) {
    for (let item in properties)
        delete properties[item];
    properties = [];

    for (let item in req.query) {
        properties.push({
            "property": item,
            "value": req.query[item]
        });
    }
}


module.exports = {

    hubspotRoute: async function (request, response) {
        if (!request.query.email)
            var url = 'https://api.hubapi.com/' + endpoint;
        else
            var url = 'https://api.hubapi.com/' + endpoint;
        try {
            createProperties(request);
            response.json(properties);
            console.log(properties);
            const data = await requestPromise({
                method: 'POST',
                url: url,
                body: {
                    properties
                },
                qs: {
                    hapikey: apikey
                },
                json: true
            });
             console.log(data.vid);
        } catch (err) {
            console.log("ya une erreur");
        }
    }
};