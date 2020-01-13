/*
Ce fichier créer les corps de texte / image, des réponses sous une syntaxe adapté à chatfuel
 */

const parse = require('./parsingTools.js');
const favoris = require('./favoris');
const sheets = require('./sheets');
const chatfuel = require('./chatfuelResponse');

// Variable global qui possède la réponse du serveur sous forme json
var replie = [];

// Permet de créer des blocks text
function createText(data) {
    var quick_replies = {};
    var buttons = {};

    if (data.title)
        chatfuel.addTitle(replie, data.title);
    if (data.quickreplies) {
        quick_replies = chatfuel.addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie.push({
            "text": data.content,
            quick_replies
        });
    } else if ((data.buttontitle && data.buttontitle !== " ") || (data.favori && data.favori !== " ")) {
        buttons = chatfuel.createButtons(data);
        replie.push({
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": data.content,
                    buttons
                }
            }
        });
    } else {
        replie.push({
            "text": data.content
        });
    }
}

// Permet de créer des blocks galleries
async function createGallerie(data) {
    var files = parse.strToArray(data.content);

    console.log(files);
    var alldata = await sheets.getSheets("14KBR0jBKfHg7ZgmggKY8tEDClcN2BXcj4gF2mzvVjUM");
    var gallerie = favoris.makeGallerie(files, alldata);
    replie.push({
        gallerie
    });
}

// Permet de créer des blocks avec des images
function createMedia(data) {
    var subtitle = data.subtitle;

    // Si c'est une image avec un titre il lui faut obligatoirement un sous-titre
    // Cette feature n'est plus utilisé depuis le 31/07/2019
    if (!subtitle)
        subtitle = " ";
    if (data.title) {
        replie.push({
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": data.title,
                            "image_url": data.content,
                            "subtitle": subtitle,
                        }
                    ]
                }
            }
        });
    } else { // Créer le block image simple
        replie.push({
            "attachment": {
                "type": "image",
                "payload": {
                    "url": data.content
                }
            }
        });
    }

    // Ajoute des quick_replie si necessaire
    if (data.quickreplies) {
        var quick_replies = chatfuel.addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie[replie.length - 1].quick_replies = quick_replies;
    } else if ((data.buttontitle && data.buttontitle !== " ") || (data.favori && data.favori !== " ")) {
        // Ajoute des boutons si necessaire
        var buttons = chatfuel.createButtons(data);
        replie[replie.length - 1].attachment.payload.elements = [{
            "title": data.title,
            "image_url": data.content,
            "subtitle": subtitle,
            buttons
        }]
    }
}


module.exports = {

    createReplie: async function (data) {
        for (var item in replie)
            delete replie[item];
        replie = [];

        // console.log(data.maintype);
        if (data.maintype === "text")
            createText(data);
        else if (data.maintype === "image")
            createMedia(data);
        else {
            await createGallerie(data);
            return (replie[0].gallerie.messages)
        }
        return (replie)
    },
};