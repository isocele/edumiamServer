const requestPromise = require('request-promise');

const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
//const email = "contact@edumiam.com";
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
        let url = 'https://api.hubapi.com/' + endpoint;
        try {
            createProperties(request);
            response.json(properties);
         /**   properties = [
                {
                    "property": "firstname",
                    "value": "Adrian"
                },
                {
                    "property": "lastname",
                    "value": "Mott"
                }];**/
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
        } catch (err) {
            console.log("ya une erreur");
        }
    }
};