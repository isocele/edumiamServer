/// init project
const express = require('express');
const app = express();
const requestPromise = require('request-promise');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

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

function findAge(birth) {
    // filtre les formats de date + les dates invalides
    if (birth[0] >= 0 && birth[1] >= 0 && birth[2] === '.' &&
        birth[3] >= 0 && birth[4] >= 0 && birth[5] === '.' &&
        birth[6] == 2 && birth[7] == 0 && birth[8] >= 1 && birth[9] >= 0)
    {
        // Sépare la chaine de caratère de la date de naissance sous différentes variables
        var day = birth[0] + birth[1];
        var month = birth[3] + birth[4];
        var century = birth[6] + birth[7];
        var decade = birth[8] + birth[9];
        var year = century + decade;

        // Créer une variable à la date du jour
        var date = new Date();
        // Calcul le nombre de jour exact séparant la date d'aujourd'hui à la date de naissance
        var ageDay = (date.getUTCFullYear() - year) * 365 + ( ( - parseInt(month, 10) + date.getUTCMonth() + 1) * 30.5) + (date.getUTCDate() - day)

        return (parseInt(ageDay/ 7, 10))
    }
    return 0;
}


app.get('/api', (request, response) => {
    const requestOptions = {
        uri: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        },
        json: true
    };
    let pertinentData = fetchData(findAge(request.query.birth), alldata);
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