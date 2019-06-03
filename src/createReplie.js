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
    }
    else if (data.buttontitle || data.favori) {
        buttons = addButtons(parseResponse(data.buttontitle, data.buttonuse), data);
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
    }
    else {
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
        replie[replie.length -1].quick_replies = quick_replies;
    }

    if (data.buttontitle || data.favori)  {
        var buttons = addButtons(parseResponse(data.buttontitle, data.buttonuse), data);
        replie[replie.length -1].attachment.payload.elements =   [{
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
            /*        buttons.push({
                        "type": rep[0][i].substring(0, rep[0][i].search(":")),
                        "title": rep[0][i].substring(rep[0][i].search(" ") + 1, rep[0][i].length),
                        [rep[1][i].substring(0, rep[1][i].search(":"))]: rep[1][i].substring(rep[1][i].search(":") + 2, rep[1][i].length)
                    })*/
            buttons.push({
                "type": data.buttontype,
                "title": data.buttontitle,
                "url": data.buttonuse
            });
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

/*function parseButton(data) {
    var lines = parse.countLine(data.buttons);

    if (lines !== parse.countLine(data.buttonsurl)) {
        console.log("il n'y a pas le meme nombre de buttons / url")
    }
    else {
        var title = parse.strToArray(data.buttons, lines);
        var urls = parse.strToArray(data.buttonsurl, lines);
    }
    for (let i = 0; i < lines; i++) {
        addButton(title[i], urls[i]);
    }
}*/

function parseResponse(titles, urls) {
    var lines = parse.countLine(titles);

    console.log(urls);
    if (lines !== parse.countLine(urls)) {
        console.log("il n'y a pas le meme nombre de buttons / url")
    }
    return ([parse.strToArray(titles), parse.strToArray(urls)]);
}

module.exports = {

    createButtons(but) {
        return addButtons(parseResponse(but.buttontitle, but.buttonuse), but)
    },

    createReplie: function (data) {
        for (var item in replie)
            delete replie[item];
        replie = [];

        if (data.maintype === "text")
            createText(data);
        else
            createMedia(data);
        return (replie)
    },
};