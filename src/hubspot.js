const requestPromise = require('request-promise');
const json = require('../assets/countrydata.json'); //(with path)
const parse = require('./parsingTools.js');
const error = require('./errorHandle.js');

//http://isocele-edumiamserver-3.glitch.me/api/user?lastname={{last name}}&firstname={{first name}}&email={{email}}&vid={{vid}}&Country={{locale}}&Gender={{gender}}&Chatfuel_user_id={{chatfuel user id}}&Chatbot_subscription={{abonné}}&City={{city}}&Postal_code={{zip}}&Street_address={{address}}

const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
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
        } else if (item === "Source") {
            properties.push({
                "property": item,
                "value": "Chatfuel :" + req.query[item]
            });
        } else if (item === "Country") {
            properties.push({
                "property": item,
                "value": json[req.query[item].substring(3, 5)]
            });
        }
    }
    properties.push({
        "property": "Type",
        "value": "Chatbot user"
    })
}


module.exports = {

    hubspotRoute: async function (request, response, requestOptions) {
        var url = '';

        console.log(request.query.vid);
        if (request.query.email && !parse.isitMail(request.query.email))
                return error.emailError(requestOptions, response);
        if (!request.query.vid)
            url = 'https://api.hubapi.com/' + endpoint;
        else
            url = 'https://api.hubapi.com/' + endpoint + "/vid/" + request.query.vid + "/profile";

        try {
            createProperties(request);
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
                vid: request.query.vid,
                json: true
            });
            if (!request.query.vid) {
                response.json({
                    data: properties,
                    status: 200,
                    "set_attributes": {
                        "vid": "" + data.vid + ""
                    }
                });
            } else {
                response.json({
                    data: properties,
                });
            }
        } catch
            (err) {
            error.requestError(requestOptions, response);
            console.log(err);
            console.log("^ Error ^");
        }
    }
};