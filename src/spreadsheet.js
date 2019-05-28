const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');

// Ouvre ou créer un document GoogleSheets selon l'url
const doc = new GoogleSpreadsheet('1K2kx6gJ5Ygmy4Jyp8XO7HMXWfN34Psf2ibKsu0EhQaQ');
// Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html

let alldata = [];
// Se connect au Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

    // Obtiens les information du SpreadSheets
    doc.getRows(1, function (err, rows) {
        alldata = rows;
    });
});


module.exports = {

    // Trouve la colonne du tableau correspondant avec l'age calculé
    fetchData: function (days) {
        for (let i = 0; i < alldata.length; i++) {
            console.log(alldata[i].cumulativeday);
            if (parseInt(alldata[i].cumulativeday, 10) === days) {
                return (alldata[i])
            }
        }
        // Gestion des exeptions plus vieux ou plus jeune que prévus
        if (days > 1095)
            return (alldata[1096]);
        else if (days < 0)
            return (alldata[-1]);
        return (-1);
    },

    spreadSheetRoute: function (request, response, requestOptions) {
        var ageDay = age.findAge(request.query.birth);

        if (ageDay === -1)
            err.ageError(requestOptions, response);
        else {
            let pertinentData = this.fetchData(ageDay);

            if (pertinentData === -1) {
                err.dayError(requestOptions, response)
            } else if (pertinentData.state && pertinentData.state !== " ") {
                // Affiche un block personnalisé ou un block existant dans Chatfuel
                var jsondata;
                if (!pertinentData.blockname || pertinentData.blockname === " ") {
                    let replies = rep.createReplie(pertinentData);
                    jsondata = {
                        data: pertinentData,
                        set_attributes: {
                            titre: pertinentData.title,
                            notification: pertinentData.content
                        },
                        "messages":
                        replies
                    };
                } else {
                    jsondata = {
                        data: pertinentData,
                        "redirect_to_blocks": [pertinentData.blockname]
                    };
                }
                requestPromise(requestOptions)
                    .then(function () {
                        response.json(jsondata);
                    });
            } else
                err.dayError(requestOptions, response);
        }
    }
};

