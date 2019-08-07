/*
Ce fichier s'occupe des requête de création de compte sur Hubspot/édition ainsi que d'une partie des favoris
*/
const requestPromise = require('request-promise');
const json = require('../assets/countrydata.json');
const parse = require('./parsingTools.js');
const error = require('./errorHandle.js');
const age = require('./age.js');

// Necessaire pour modifier les contact Hubspot via l'API
const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";
const endpoint = "contacts/v1/contact";

// Une global qui detient toutes les valeurs ajouter au compte Hubspot sous format JSON
var properties = [];

// Créer toutes les valeurs nécessaire à la création d'un compte (notament les valeurs fixes ou au format diff de chatfuel)
function createProperties(req) {
    for (let item in properties)
        delete properties[item];
    properties = [];

    // Parse tout le query et transforme certain elmt pour une syntaxe plus compréhensible
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
        } else if (item === "Country") { // Convertis les valeurs des localité de chatfuel en designation classique ex: fr_FR = France
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

    // Fais la requête à Hubspot
    hubspotApi: async function (req, url, properties, method, response) {
        var ret;

        try {
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
            // error.requestError(response, err.error.message);
            console.log(err.message);
            return -1
        }
        return ret
    },

    // Gère les requêtes concernant Hubspot et créer la réponse en json
    hubspotRoute: async function (request, response, requestOptions) {
        var url = '';

        if (request.query.email && !parse.isitMail(request.query.email))
                return error.emailError(response);

        // Nouveau contact => Création du contact
        if (!request.query.vid)
            url = 'https://api.hubapi.com/' + endpoint;
        else // Ancien Contact => Mise à jour de ses infos
            url = 'https://api.hubapi.com/' + endpoint + "/vid/" + request.query.vid + "/profile";

        // Requête à Hubspot; dans un try au cas où l'API de Hubspot est down / ma requête est mauvaise
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