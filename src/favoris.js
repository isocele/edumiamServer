const requestPromise = require('request-promise');
const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";

const parse = require('./parsingTools.js');
const sheets = require('./notification');
const replie = require('./createReplie');
const hub = require('./hubspot');

var gallerie = {};

function createFavoris(req) {
    if (req.query.push)
        return ("push: " + req.query.push);
    if (req.query.block)
        return ("block: " + req.query.block)
}

async function newFavoris(req, res) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var favoris = await hub.hubspotApi(req, url, {}, 'GET', res);
    //console.log(favoris);

    if (favoris === -1)
        return (-1);
    var fav = {};
    if (favoris.properties.favoris && favoris.properties.favoris.value)
        fav = favoris.properties.favoris.value + "\n" + createFavoris(req);
    else
        fav = createFavoris(req);

    const ndata = hub.hubspotApi(req, url, [{
        "property": "favoris",
        "value": fav
    }], 'POST', res);

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
    console.log(block.title)
    if (block.buttontitle)
        buttons = replie.createButtons(block);
    gallerie.messages[0].attachment.payload.elements.push({
        "title": block.title,
        "image_url": block.content,
        buttons
    });
}

async function drawFavoris(req, response) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hub.hubspotApi(req, url, {}, 'GET', response);

    if (info !== -1) {
        var favoris = parse.strToArray(info.properties.favoris.value);
        initGallerie();
        for (let i = 0; i < favoris.length; i++) {
            if (favoris[i].substring(0, favoris[i].search(':')) === "push") {
                var alldata = await sheets.getSheets("14KBR0jBKfHg7ZgmggKY8tEDClcN2BXcj4gF2mzvVjUM");
                // addtoGallerie(sheets.fetchData(parseInt(favoris[i].substring(favoris[i].search(":") + 2, favoris[i].length),
                //     10), alldata));
                // TODO changer ^
                addtoGallerie(sheets.fetchData(favoris[i].substring(favoris[i].search(":") + 2, favoris[i].length), alldata));
            } else {
                console.log("erreur : Mauvais format ?");
                console.log(favoris[i].substring(0, favoris[i].search(':')));
            }
        }
    }
    return 0
}

module.exports = {

    addFavorisRoute: async function (req, response) {
        const result = await newFavoris(req, response);

        if (result !== -1)
            response.json(result);
    },

    drawFavorisRoute: async function (req, response) {
        const result = await drawFavoris(req, response);

        if (result !== -1)
            response.json(gallerie);
    }
};