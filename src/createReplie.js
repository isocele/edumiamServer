const parse = require('./parsingTools.js');

var replie = [];

function createText(data) {
    var quick_replies = {};
    var buttons = {};

    addTitle(data.title);
    if (data.quickreplies) {
        quick_replies = addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie.push({
            "text": data.content,
            quick_replies
        });
    } else if (data.buttontitle || data.favori) {
        buttons = addButtons(parseResponse(data.buttontitle, data.buttontype, data.buttonuse), data);
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
        var quick_replies = addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie[replie.length - 1].quick_replies = quick_replies;
    }

    if (data.buttontitle || data.favori) {
        var buttons = addButtons(parseResponse(data.buttontitle, data.buttonuse), data);
        replie[replie.length - 1].attachment.payload.elements = [{
            "title": data.title,
            "image_url": data.content,
            "subtitle": subtitle,
            buttons
        }]
    }
}

function addQuickReplie(rep) {
    var quick_replies = [];

    for (let i = 0; i < rep[0].length; i++) {
        quick_replies.push({
            "title": rep[0][i],
            "block_names": [rep[1][i].substring(6)],
        })
    }
    return quick_replies;
}

function addButtons(rep, data) {
    var buttons = [];

    if (data.buttontitle) {
        for (let i = 0; i < rep[0].length; i++) {
            buttons.push({
                "type": rep[1][i],
                "title": rep[0][i],
                "url": rep[2][i]
            })
            /*            buttons.push({
                            "type": data.buttontype,
                            "title": data.buttontitle,
                            "url": data.buttonuse
                        });*/
        }
    }
    if (data.favori)
        buttons.push({
            "type": "json_plugin_url",
            "title": "Sauvegarder",
            "url": "http://isocele-edumiamserver-3.glitch.me/api/favoris/new?vid={{vid}}&push=" + data.favori
        });
    //console.log(buttons)
    return buttons;
}

function addTitle(title) {
    replie.push({"text": title});
}

function parseResponse(titles, types, urls) {
    var lines = parse.countLine(titles);

    if (lines !== parse.countLine(urls))
        console.log("il n'y a pas le meme nombre de buttons / url")
    return ([parse.strToArray(titles), parse.strToArray(types), parse.strToArray(urls)]);
}

module.exports = {

    createButtons(but) {
        return addButtons(parseResponse(but.buttontitle, but.buttontype, but.buttonuse), but)
    },

    createReplie: function (data) {
        for (var item in replie)
            delete replie[item];
        replie = [];

        // console.log(data.maintype);
        if (data.maintype === "text")
            createText(data);
        else
            createMedia(data);
        return (replie)
    },
};