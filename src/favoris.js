const requestPromise = require('request-promise');
const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";

const parse = require('./parsingTools.js');
const sheets = require('./notification');
const replie = require('./createReplie');

var gallerie = {};


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
        return ("push: " + req.query.push);
    if (req.query.block)
        return ("block: " + req.query.block)
}

async function newFavoris(req) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var favoris = await hubspotApi(req, url, {}, 'GET');
    //console.log(favoris);

    if (favoris === -1)
        return ("failure");
    var fav = {};
    if (favoris.properties.favoris && favoris.properties.favoris.value)
        fav = favoris.properties.favoris.value + "\n" + createFavoris(req);
    else
        fav = createFavoris(req);

    const ndata = hubspotApi(req, url, [{
        "property": "favoris",
        "value": fav
    }], 'POST');

    return ({
        "success": 200,
        "messages": [
            {"text": "Vous avez ajoutez un nouveau favori !"},
        ]
    });
}

function initGallerie() {
    gallerie = {
        "messages": [
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": []
                    }
                }
            }
        ]
    };
}

function addtoGallerie(block) {
    var buttons = [];

    //console.log(block);
    if (block.buttontitle)
        buttons = replie.createButtons(block);
    gallerie.messages[0].attachment.payload.elements.push({
        "title": block.title,
        "image_url": block.content,
        buttons
    });
}

async function drawFavoris(req) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hubspotApi(req, url, {}, 'GET');
    var favoris = parse.strToArray(info.properties.favoris.value);

    initGallerie();
    for (let i = 0; i < favoris.length; i++) {
        if (favoris[i].substring(0, favoris[i].search(':')) === "push") {
            addtoGallerie(sheets.fetchData(parseInt(favoris[i].substring(favoris[i].search(":") + 2, favoris[i].length),
                10), await sheets.getSheetsData("14KBR0jBKfHg7ZgmggKY8tEDClcN2BXcj4gF2mzvVjUM")));
        } else {
            console.log(favoris[i].substring(0, favoris[i].search(':')));
        }
    }
}

module.exports = {

    addFavorisRoute: async function (req, response) {
        const result = await newFavoris(req);

        response.json(result);
    },

    drawFavorisRoute: async function (req, response) {
        const result = await drawFavoris(req);

        response.json(
            gallerie);
    }
};