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
    var quick_replies = {};
    if (data.quickreplies)
        quick_replies = addQuickReplie(parseResponse(data.quickreplies, data.quickrepliesurl));
    replie.push({
        "attachment": {
            "type": data.maintype,
            "payload": {
                "url": data.content
            }
        },
        quick_replies
    })
}

/*function createGallerie(data) {
    replie = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": data.content
            }
        }
    }
}

function parseMainType(data) {
    switch (data.maintype) {
        case "text" :
            createText(data);
            break;
        case "image":
            createMedia(data);
            break;
        case "video":
            createMedia(data);
            break;
        case "son":
            createMedia(data);
            break;
        case "gallerie":
            createGallerie(data);
            break;
        default:
            break;
    }
}

function addButton(title, url) {
    console.log(title)
}*/

function addQuickReplie(rep) {

    var quick_replies = [];
    for (let i = 0; i < rep[0].length; i++) {
        // if (rep[1][i].substring(0, 5) === "block") {

            quick_replies.push({
                "title": rep[0][i],
                "block_names": [rep[1][i].substring(6)],
            })
/*
        } else if (rep[1][i].substring(0, 5) === "value") {
            quick_replies.push({
                "title": rep[0][i],
                "set_value": [rep[1][i].substring(6)],
            })
        }
*/
    }
    console.log(quick_replies);
    return quick_replies;
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
}

 function parseQuickReplie(data) {
    var lines = parse.countLine(data.quickreplies);

    if (lines !== parse.countLine(data.quickrepliesurl)) {
        console.log("il n'y a pas le meme nombre de buttons / url")
    }
    else {
        var title = parse.strToArray(data.quickreplies, lines);
        var urls = parse.strToArray(data.quickrepliesurl, lines);
    }
    console.log(urls);
    for (let i = 0; i < lines; i++) {
        addQuickReplie(title[i], urls[i]);
    }
}*/

function parseResponse(titles, urls) {
    var lines = parse.countLine(titles);

    if (lines !== parse.countLine(urls)) {
        console.log("il n'y a pas le meme nombre de buttons / url")
    }
    return ([parse.strToArray(titles, lines), parse.strToArray(urls, lines)]);
}

module.exports = {

    createReplie: function (data) {
        for (var item in replie)
            delete replie[item];
        replie = [];

        addTitle(data.title);
        if (data.maintype === "text")
            createText(data);
        else
            createMedia(data);
        if (data.buttons)
            parseResponse(data.buttons, data.buttonsurl);
        return (replie)
    },
};