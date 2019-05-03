const parse = require('./parsingTools.js')

var replie = [];

function createText(data) {
    replie.push({
        "text": data.content
    })
}



function createImage(data) {
    replie = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": data.content
            }
        }
    }
}

function createVideo(data) {
    replie = {
        "attachment": {
            "type": "video",
            "payload": {
                "url": data.content
            }
        }
    }
}

function createSon(data) {
    replie = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": data.content
            }
        }
    }
}

function createGallerie(data) {
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
            createImage(data);
            break;
        case "video":
            createVideo(data);
            break;
        case "son":
            createSon(data);
            break;
        case "gallerie":
            createGallerie(data);
            break;
        default:
            break;
    }
}

function addButton(title, url) {

}

function addTitle(title) {
    replie.push({"text": title});
}

function parseButton(data) {
    var lines = parse.countLine(data.buttons);

    if (lines !== parse.countLine(data.buttonsurl)) {
        console.log("il n'y a pas le meme nombre de buttons / url")
    }
    else {
        title = parse.strToArray(data.buttons, lines);
        urls = parse.strToArray(data.buttonsurl, lines);
    }
    for (let i = 0; i < lines; i++) {
        addButton(title[i], urls[i]);
    }
}

module.exports = {

    createReplie: function (data) {

        addTitle(data.title);
        parseMainType(data);
        console.log(replie)
        if (data.buttons)
            parseButton(data);
        return (replie)
    },


};