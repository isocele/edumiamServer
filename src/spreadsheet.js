/// init project
const express = require('express');
const app = express();
const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');

var age = require('./age.js');
var err = require('./errorHandle.js')
var rep = require('./createReplie.js')

// Ouvre ou créer un document GoogleSheets selon l'url
var doc = new GoogleSpreadsheet('11b-R9LT6SlAwCXYhXDyYGg-pw0p0okDnHzswG-qUfDM');

let alldata = [];
// Se connect au Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

    // Obtiens les information du SpreadSheets
    doc.getRows(1, function (err, rows) {
        alldata = rows;
    });
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Trouve la colonne du tableau correspondant avec l'age calculé
function fetchData(days) {
    for (let i = 0; i < alldata.length; i++) {
        if (parseInt(alldata[i].semainescumulee, 10) === days) {
            return (alldata[i])
        }
    }
    return 1;
}


app.get('/api', (request, response) => {
    const requestOptions = {
        uri: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        },
        json: true
    };

    var ageDay = age.findAge(request.query.birth);
    if (ageDay === -1 || ageDay === -2) {
        err.ageError(requestOptions, response)
    }
    else {
        let pertinentData = fetchData(ageDay, alldata);
        if (pertinentData === 1) {
            console.log("oui")
            err.ageError(requestOptions, response)
        }
        else {
            console.log(pertinentData.existingblock);
            if (pertinentData.existingblock) {
                var jsondata = {
                    data: pertinentData,
                    "redirect_to_blocks": [pertinentData.existingblock]
                };
            }
            else {
                let replies = rep.createReplie(pertinentData);
                var jsondata = {
                    data: pertinentData,
                    set_attributes: {
                        titre: pertinentData.catégorie,
                        notification: pertinentData.push
                    },
                    "messages":
                        replies
                };
            }
            requestPromise(requestOptions)
                .then(function (data) {
                    response.json(jsondata);
                });
        }
    }
});

const PORT = 8000;

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});