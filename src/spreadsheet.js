const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');

// Ouvre ou créer un document GoogleSheets selon l'url
const doc = new GoogleSpreadsheet('1tcGXwUPpehBN-ynWwYJoC5zn33YiqswCYsJQGZeNyD0');
// Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html

let alldata = [];
// Se connect au Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

    // Obtiens les information du SpreadSheets
    doc.getRows(1, function (err, rows) {
        alldata = rows;
    });
});

// Trouve la colonne du tableau correspondant avec l'age calculé
function fetchData(days) {
    for (let i = 0; i < alldata.length; i++) {
        if (parseInt(alldata[i].jourcumule, 10) === days) {
            return (alldata[i])
        }
    }
    // Gestion des exeptions plus vieux ou plus jeune que prévus
    if (days > 1095)
        return (alldata[1096]);
    else if (days < 0)
        return (alldata[-1]);
    return (-1);
}


module.exports = {

    spreadSheetRoute: function (request, response, requestOptions) {
        var ageDay = age.findAge(request.query.birth);
        if (ageDay === -1)
            err.ageError(requestOptions, response);
        else {
            let pertinentData = fetchData(ageDay, alldata);
            if (pertinentData === -1) {
                err.dayError(requestOptions, response)
            } else {
                // Affiche un block personnalisé ou un block existant dans Chatfuel
                var jsondata;
                if (!pertinentData.existingblock) {
                    let replies = rep.createReplie(pertinentData);
                    jsondata = {
                        data: pertinentData,
                        set_attributes: {
                            titre: pertinentData.catégorie,
                            notification: pertinentData.push
                        },
                        "messages":
                        replies
                    };
                } else {
                    jsondata = {
                        data: pertinentData,
                        "redirect_to_blocks": [pertinentData.existingblock]
                    };
                }
                requestPromise(requestOptions)
                    .then(function () {
                        response.json(jsondata);
                    });
            }
        }
    }
};

