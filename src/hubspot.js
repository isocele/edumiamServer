const requestPromise = require('request-promise');
const json = require('../assets/countrydata.json'); //(with path)
const parse = require('./parsingTools.js')

const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
const postemail = "contact@edumiam.com";
const endpoint = "contacts/v1/contact";

var properties = [];

function createProperties(req) {
    for (let item in properties)
        delete properties[item];
    properties = [];

    for (let item in req.query) {
        if (item !== "vid" && item !== "Country" && item !== "Source") {
            properties.push({
                "property": item,
                "value": req.query[item]
            });
        }
        else if (item === "Source") {
            properties.push({
                "property": "Chatfuel :" + item,
                "value": req.query[item]
            });
        }
        else if (item === "Country") {
            properties.push({
                "property": item,
                "value": json[req.query[item].substring(3,5)]
            });
        }
    }
}


module.exports = {

    hubspotRoute: async function (request, response) {
        if (!request.query.email)
            var url = 'https://api.hubapi.com/' + endpoint;
        else {
            var url = 'https://api.hubapi.com/' + endpoint + "/vid/" + request.query.vid + "/profile";
            console.log(url);
        }

        try {
            createProperties(request);
            //    console.log(properties);
            const data = await requestPromise({
                method: 'POST',
                url: url,
                body: {
                    properties
                },
                qs: {
                    hapikey: apikey
                },
                vid: request.query.vid,
                json: true
            });
            var setattributes = {};

            if (!request.query.email) {
                setattributes = {
                    "set_attributes": {
                        "vid": data.vid
                    }
                };
            }
            response.json({
                data: properties,
                setattributes
            });
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }
};