const parse = require('./parsingTools.js');
const favoris = require('./favoris');
const sheets = require('./sheets');
const chatfuel = require('./chatfuelResponse');

var replie = [];

function createText(data) {
    var quick_replies = {};
    var buttons = {};

    addTitle(data.title);
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

async function createGallerie(data) {
    var files = parse.strToArray(data.content);

    var alldata = await sheets.getSheets("1RPMo96lLAXLk9c_XnIm8vlL8jqcfPK9gCNQ7wxMkP3A");
    var gallerie = favoris.makeGallerie(files, alldata);
    replie.push({
        gallerie
    });
}

function createMedia(data) {
    var subtitle = data.subtitle;

    if (!subtitle)
        subtitle = " ";
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

    if (data.quickreplies) {
        var quick_replies = chatfuel.addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie[replie.length - 1].quick_replies = quick_replies;
    } else if ((data.buttontitle && data.buttontitle !== " ") || (data.favori && data.favori !== " ")) {
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
        else
            await createGallerie(data);
        return (replie)
    },
};