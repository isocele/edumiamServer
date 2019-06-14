const {google} = require('googleapis');
var sheets = google.sheets('v4');
var fs = require('fs');
const requestPromise = require('request-promise');

async function writeSheet(requestOptions) {

    console.log(ret)
}

function parseData(contents) {
    var ret = [];
    var jbis = 0;
    var tmp = 0;
    var max = 0;

    for (let i = 0; i < contents.length; i++) {
        if (contents[i] === '-' && contents[i + 1] === '-') {
            max++;
            i +=2;
        }
    }
    for (let i = 0; i <= max; i++, jbis++) {
        for (; contents[jbis] !== '\n' && jbis < contents.length; jbis++);
        jbis++;
        tmp = jbis;
        for (; (contents[jbis] !== '-' || contents[jbis + 1] !== '-') && jbis < contents.length; jbis++);
        ret.push(contents.substring(tmp, jbis -2));
    }
    for (let i = 0; i < ret.length; i++) {
        console.log(JSON.stringify(ret[i]), ",");
    }
    return(ret)
}

function parseNumber(contents) {
    var ret = [];

    for (let i = 0; i < contents.length; i++) {
        if (contents[i] === '-' && contents[i + 1] === '-') {
            i +=2;
            let j = i;
            for (; contents[j] !== '\n'; j++);
            ret.push(contents.substring(i, j))
        }
    }
    console.log(ret);
}

module.exports = {

    scrapfileRoute: function (response) {
        let path = './assets/chatbot_conv';

        fs.readFile(path, 'utf8', function (err, contents) {
            if (contents) {
                parseData(contents);
                response.json({
                    status: 200,
                });
            } else if (err) {
                response.json({
                    status: 401,
                    log: "Fichier " + path + " manquant"
                });
                console.log(err);
            }
        });
    }
};