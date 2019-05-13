/// init project
const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');

const age = require('./age.js');
const err = require('./errorHandle.js')
const rep = require('./createReplie.js')

// Ouvre ou créer un document GoogleSheets selon l'url
const doc = new GoogleSpreadsheet('11b-R9LT6SlAwCXYhXDyYGg-pw0p0okDnHzswG-qUfDM');

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
//        if (parseInt(alldata[i].semainescumulee, 10) === days) {
        if (alldata[i].semainescumulee === days) {
            return (alldata[i])
        }
    }
    return 1;
}



module.exports = {

    spreadSheetRoute: function(request, response, requestOptions) {
        //var ageDay = age.findAge(request.query.birth);
        var ageDay = request.query.birth;
        console.log(ageDay);
        if (ageDay === -1 || ageDay === -2) {
            err.ageError(requestOptions, response)
        } else {
            let pertinentData = fetchData(ageDay, alldata);
            console.log(pertinentData);
            if (pertinentData === 1) {
                err.ageError(requestOptions, response)
            } else {
                if (pertinentData.existingblock) {
                    var jsondata = {
                        data: pertinentData,
                        "redirect_to_blocks": [pertinentData.existingblock]
                    };
                } else {
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
    }
};

