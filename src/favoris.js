const requestPromise = require('request-promise');
const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";

async function hubspotApi(req, url, properties, method) {
    var ret;
    console.log(properties);

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
        console.log(err);
        console.log("^ Error ^");
        return -1
    }
    return ret
}

function createFavoris(req) {
    if (req.query.push)
        return ("push:" + req.query.push);
    if (req.query.block)
        return ("block:" + req.query.block)
}

async function newFavoris(req) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile"
    var favoris = await hubspotApi(req, url, {},'GET');

    if (favoris === -1)
        return ("failure");
    var fav = favoris.properties.favoris.value + "\n" + createFavoris(req);
    console.log(fav);

    const ndata = hubspotApi(req, url, [{
        "property": "favoris",
        "value": fav
    }], 'POST');

    return ("success")
}

async function createFavReplie(req) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile"
    var favoris = await hubspotApi(req, url, {},'GET');


}

module.exports = {

    addFavorisRoute: async function (req, response) {
        const result = await newFavoris(req);

        response.json({
            result
        });
    },

    drawFavorisRoute: async function (req, response) {
        const result = await new(req);

        response.json({
            result
        });
    }
};