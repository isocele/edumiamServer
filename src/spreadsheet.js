/// init project
const express = require('express');
const app = express();
const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');
var age = require('./age.js');

// Ouvre ou créer un document GoogleSheets selon l'url
var doc = new GoogleSpreadsheet('1XofCw00y2i55yXFWatwI6zkRokzWqnl09oZGRKZ6by4');

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
        if (parseInt(alldata[i].semainescumulees, 10) === days) {
            return (alldata[i])
        }
    }
}

app.get('/api', (request, response) => {
    const requestOptions = {
        uri: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        },
        json: true
    };
    let pertinentData = fetchData(age.findAge(request.query.birth), alldata);
    console.log(pertinentData.push, pertinentData.catégorie)
    requestPromise(requestOptions)
        .then(function(data) {
            response.json({
                set_attributes: {
                    titre: pertinentData.catégorie,
                    notification: pertinentData.push
                }

            });
        });
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});