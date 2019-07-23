const parse = require('./parsingTools.js');
const sheets = require('./sheets');
const chatfuel = require('./chatfuelResponse');
const hub = require('./hubspot');
const error = require('./errorHandle');


var gallerie = {};

// Fais la syntaxe à sauvegarder dans Hubspot pour etre capable de le lire dans favoris.js
function createFavoris(req) {
    if (req.query.push)
        return ("push: " + req.query.push);
    if (req.query.block)
        return ("block: " + req.query.block)
}

// Permet de checker avant d'ajouter un nouveau favoris si il est deja enregistré
function checkDouble(fav, add) {
    var arrfav = parse.strToArray(fav);

    for (let i = 0; i < arrfav.length; i++) {
        if (arrfav[i].substring(arrfav[i].search(':') + 2, arrfav[i].length) === add) {
            return false
        }
    }
    return true
}

// Réecris la valeur <favori> de hubspot avec un favori de moins
function deleteFavoris(fav, del) {
    var arrfav = parse.strToArray(fav);
    var newfav = "";

    for (let i = 0; i < arrfav.length; i++) {
        if (arrfav[i].substring(arrfav[i].search(':') + 2, arrfav[i].length) !== del)
            newfav += arrfav[i].toString() + '\n';
    }

    // Renvoit sans le dernier '\n'
    return (newfav.substring(0, newfav.length - 1));
}

// Va aller chercher les anciens favoris et en ajouter un nouveau si possible pour enfin mettre le profil à jour
async function newFavoris(req, res) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var favoris = await hub.hubspotApi(req, url, {}, 'GET', res);

    if (favoris === -1)
        return (-1);
    var fav = {};
    if (favoris.properties.favoris && favoris.properties.favoris.value) {
        // Vérifie si ce favori a déjà été enregistré et block les doublons
        if (!checkDouble(favoris.properties.favoris.value, req.query.push))
            return ({
                "success": 406,
                "messages": [
                    {"text": "Vous avez déjà enregistré ce favori"},
                ]
            });
        // Limite le nombre de favoris à 10
        else if (parse.strToArray(favoris.properties.favoris.value).length > 9)
            return ({
                "success": 406,
                "messages": [
                    {"text": "Vous avez déjà 10 favoris"},
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

// Créer le squelette d'une réponse affichant une gallerie pour Chatfuel
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

// Ajoute une fiche à la gallerie
function addtoGallerie(memo) {
    var buttons = [];
    var subtitle = memo.subtitle;

    if (!memo.subtitle)
        subtitle = " ";
    if (memo.buttontitle)
        buttons = chatfuel.createButtons(memo);
    gallerie.messages[0].attachment.payload.elements.push({
        "title": memo.title,
        "image_url": memo.content,
        "subtitle": subtitle,
        buttons
    });
}

// Créer la réponse pour que Chatfuel affiche la gallerie de favorisen parsant le query...
async function drawFavoris(req, response) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hub.hubspotApi(req, url, {}, 'GET', response);

    if (info !== -1 && info.properties.favoris) {
        var favoris = parse.strToArray(info.properties.favoris.value);
        var alldata = await sheets.getSheets("14KBR0jBKfHg7ZgmggKY8tEDClcN2BXcj4gF2mzvVjUM");
        initGallerie();
        for (let i = 0; i < favoris.length; i++) {
            if (favoris[i].substring(0, favoris[i].search(':')) === "push") {
                addtoGallerie(sheets.fetchData(favoris[i].substring(favoris[i].search(":") + 2, favoris[i].length), alldata), alldata);
            } else {
                console.log("erreur : Mauvais format ?");
                console.log(favoris[i].substring(0, favoris[i].search(':')));
                return -1
            }
        }
        return 0
    }
    return -1
}

// Gére la suppresion d'un favori et met à jour le profil Hubspot
async function checkDelete(req, res) {
    const url = 'https://api.hubapi.com/contacts/v1/contact/vid/' + req.query.vid + "/profile";
    var info = await hub.hubspotApi(req, url, {}, 'GET', res);
    var message = "";
    var status = 0;

    if (info !== -1) {
        if (info.properties.favoris && info.properties.favoris.value) {
            if (checkDouble(info.properties.favoris.value, req.query.push)) {
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
        else
            error.favorisError(response);

    },

    deleteFavorisRoute: async function (req, res) {
        const result = await checkDelete(req, res);
        console.log(result);

        res.json(result);
    },

    // Utilise les fonctions de Favoris pour faire une gallerie standard
    makeGallerie: function (files, alldata) {
        initGallerie();

        for (let i = 0; i < files.length; i++) {
            addtoGallerie(sheets.fetchData(files[i], alldata));
        }
        return gallerie;
    }
};
