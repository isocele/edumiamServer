const parse = require('./parsingTools.js')

var replie = [];

function createText(data) {
    var quick_replies = {};
    if (data.quickreplies)
        quick_replies = addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
    replie.push({
        "text": data.content,
        quick_replies
    });
}

function createMedia(data) {

    replie.push({
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": data.title,
                        "image_url": data.content,
                        "subtitle": "empty subtitle",
                    }
                ]
            }
        }
    });

    if (data.quickreplies) {
        var quick_replies = addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
        replie[replie.length -1].quick_replies = quick_replies;
    }

    console.log(data);
    if (data.buttontitle)  {
        var buttons = addButtons(parseResponse(data.buttontitle, data.buttonuse));
        replie[1].attachment.payload.elements =   [{
            "title": data.title,
            "image_url": data.content,
            "subtitle": "empty subtitle !!",
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

function addButtons(rep) {
    var buttons = [];

    for (let i = 0; i < rep[0].length; i++) {
        buttons.push({
            "type": rep[0][i].substring(0, rep[0][i].search(":")),
            "title": rep[0][i].substring(rep[0][i].search(" ") + 1, rep[0][i].length),
            [rep[1][i].substring(0, rep[1][i].search(":"))]: rep[1][i].substring(rep[1][i].search(":") + 2, rep[1][i].length)
        })
    }
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
        return addButtons(parseResponse(but.buttontitle, but.buttonuse))
    },

    createReplie: function (data) {
        for (var item in replie)
            delete replie[item];
        replie = [];

        addTitle(data.title);
        if (data.maintype === "text")
            createText(data);
        else
            createMedia(data);
        if (data.buttontitle)
            addButtons(parseResponse(data.buttontitle, data.buttonuse));
        return (replie)
    },
};