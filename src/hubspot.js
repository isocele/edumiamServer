const requestPromise = require('request-promise');
const json = require('../assets/countrydata.json'); //(with path)
const parse = require('./parsingTools.js');
const error = require('./errorHandle.js');
const age = require('./age.js');

//http://isocele-edumiamserver-3.glitch.me/api/user?lastname={{last name}}&firstname={{first name}}&email={{email}}&vid={{vid}}&Country={{locale}}&Gender={{gender}}&Chatfuel_user_id={{chatfuel user id}}&Chatbot_subscription={{abonné}}&City={{city}}&Postal_code={{zip}}&Street_address={{address}}

const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
const endpoint = "contacts/v1/contact";

var properties = [];

function createProperties(req) {
    for (let item in properties)
        delete properties[item];
    properties = [];

    for (let item in req.query) {
        if (item === "babybirth")
            if (age.findAge(req.query[item]) === "error")
                return false;
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
    });
    return true
}


module.exports = {

    hubspotApi: async function (req, url, properties, method, response) {
        var ret;

        try {
            // console.log(data)
            ret = await requestPromise({
                method: method,
                url: url,
                body: {
                    properties: properties
                },
                qs: {
                    hapikey: apikey
                },
                vid: req.query.vid,
                json: true
            });
        } catch (err) {
            error.requestError(response);
            console.log(err.error);
            return -1
        }
        return ret
    },

    hubspotRoute: async function (request, response, requestOptions) {
        var url = '';

        if (request.query.email && !parse.isitMail(request.query.email))
                return error.emailError(response);
        if (!request.query.vid)
            url = 'https://api.hubapi.com/' + endpoint;
        else
            url = 'https://api.hubapi.com/' + endpoint + "/vid/" + request.query.vid + "/profile";

        try {
            var valid = createProperties(request);
            if (valid)
                var data = await this.hubspotApi(request, url, properties, 'POST', response);
            else
                error.ageError(response);
            if (valid && !request.query.vid && data !== -1) {
                response.json({
                    data: properties,
                    status: 200,
                    "set_attributes": {
                        "vid": "" + data.vid + ""
                    }
                });
            } else if (valid && data !== -1) {
                response.json({
                    data: properties,
                });
            }
        } catch
            (err) {
            error.requestError(response);
            console.log(err);
            console.log("^ Error ^");
        }
    }
};