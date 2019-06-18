const requestPromise = require('request-promise');
const apikey = "2e27342c-a4bb-4b3c-a1fa-30f8b9b0f702";

const parse = require('./parsingTools.js');
const sheets = require('./notification');
const replie = require('./createReplie');
const hub = require('./hubspot');
const error = require('./errorHandle');


var gallerie = {};

function createFavoris(req) {
    if (req.query.push)
        return ("push: " + req.query.push);
    if (req.query.block)
        return ("block: " + req.query.block)
}

function checkdouble(fav, add) {
    var arrfav = parse.strToArray(fav);

    for (let i = 0; i < arrfav.length; i++) {
        if (arrfav[i].substring(arrfav[i].search(':') + 2, arrfav[i].length) === add) {
            return false
        }
    }
    return true
}

function deleteFavoris(fav, del) {
    var arrfav = parse.strToArray(fav);
    var newfav = "";

    for (let i = 0; i < arrfav.length; i++) {
        if (arrfav[i].substring(arrfav[i].search(':') + 2, arrfav[i].length) !== del)
            newfav += arrfav[i].toString() + '\n';
    }

    return (newfav.substring(0, newfav.length - 1));
}

async function newFavoris(req, res) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var favoris = await hub.hubspotApi(req, url, {}, 'GET', res);
    //console.log(favoris);

    if (favoris === -1)
        return (-1);
    var fav = {};
    if (favoris.properties.favoris && favoris.properties.favoris.value) {
        if (!checkdouble(favoris.properties.favoris.value, req.query.push))
            return ({
                "success": 406,
                "messages": [
                    {"text": "Vous avez déjà enregistré ce favoris"},
                ]
            });
        else
            fav = favoris.properties.favoris.value + "\n" + createFavoris(req);
    } else
        fav = createFavoris(req);

    const ndata = hub.hubspotApi(req, url, [{
        "property": "favoris",
        "value": fav
    }], 'POST', res);

    return ({
        "success": 200,
        "messages": [
            {"text": "Vous avez ajouté un nouveau favori !"},
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

async function drawFavoris(req, response) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hub.hubspotApi(req, url, {}, 'GET', response);

    if (info !== -1 && info.properties.favoris) {
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
        return 0
    }
    error.favorisError(response);
    return -1
}

async function checkDelete(req, res) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hub.hubspotApi(req, url, {}, 'GET', res);
    var message = "";
    var status = 0;

    if (info !== -1) {
        if (info.properties.favoris && info.properties.favoris.value) {
            if (checkdouble(info.properties.favoris.value, req.query.push)) {
                status = 406;
                message = "Vous n'avez pas enregistré ce favoris";
            } else {
                var favoris = deleteFavoris(info.properties.favoris.value, req.query.push, req, res);
                const ndata = hub.hubspotApi(req, url, [{
                    "property": "favoris",
                    "value": favoris
                }], 'POST', res);
                status = 406;
                message = "Favoris supprimé";
            }
        } else {
            status = 406;
            message = "Vous n'avez pas de favoris enregistré";
        }
    }
    return ({
        "success": status,
        "messages": [
            {"text": message},
        ]
    });
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
    },

    deleteFavorisRoute: async function (req, res) {
        const result = await checkDelete(req, res);

        res.json(result);
    }
};
