const {google} = require('googleapis');
var sheets = google.sheets('v4');
var fs = require('fs');
const requestPromise = require('request-promise');

async function writeSheet(requestOptions) {

    console.log(ret)
}

function parseData(contents) {
    /*for (let i = 0; i < contents.length ; i++) {
        console.log(contents[i])
    }*/

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

    scrapfileRoute: function (response, requestOptions) {

        fs.readFile('./assets/chatbot_conv', 'utf8', function (err, contents) {
            if (contents) {
                //console.log(contents);
                parseNumber(contents);
                //writeSheet(requestOptions);
            }

            else if (err)
                console.log(err);
        });
        console.log('after calling readFile');
    }

};
