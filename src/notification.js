const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../client_secret.json');
const delay = require('delay');

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');


// Affiche un block personnalisé ou un block existant dans Chatfuel
function createResponse(pertinentData, requestOptions, response) {

    var jsondata;
    if (!pertinentData.blockname || pertinentData.blockname === " ") {
        let replies = rep.createReplie(pertinentData);
        jsondata = {
            "messages":
            replies
        };
    } else {
        jsondata = {
            "redirect_to_blocks": [pertinentData.blockname]
        };
    }
    requestPromise(requestOptions)
        .then(function () {
            response.json(jsondata);
        });
}

function nextNotif(day, data) {
    var i = 0;

    for (; data[i].id !== day; i++);
    i++;
    for (; !data[i].state || data[i].state === " "; i++);
    return data[i].id;
}

module.exports = {

    // Trouve la colonne du tableau correspondant avec l'id (jour cummulé ou id favoris)
    fetchData: function (id, data) {
        for (let i = 0; i < data.length; i++) {
            if (parseInt(data[i].id, 10) === id) {
                //TODO si on repasse en format date changer les format de variable
            //if (data[i].id === id) {
                console.log(data[i])
                return (data[i])
            }
        }
        // Gestion des exeptions plus vieux ou plus jeune que prévus
        if (id > 1095)
            return (data[1096]);
        else if (id < 0)
            return (data[-1]);
        return (-1);
    },

    getSheets: async function (url) {
        // Ouvre ou créer un document GoogleSheets selon l'url
        const doc = new GoogleSpreadsheet(url);
        let data = [];

        // Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html
        // Se connecte au Google Spreadsheets API.
        data = doc.useServiceAccountAuth(creds, function (err) {
            // Obtiens les information du SpreadSheets
            doc.getRows(1, function (err, rows) {
                data = rows;
            });
        });
        // Attends les infos du google doc
        try {
            await delay.reject(2000, {value: new Error(data)});
        } catch (error) {
            // Attends 2 secondes
            return (data)
        }
    },

    spreadSheetRoute: async function (request, response, requestOptions) {
        var ageDay = age.findAge(request.query.babybirth);

        // var ageDay = request.query.babybirth;
        if (ageDay === -1)
            err.ageError(response);
        else {
            let allData = await this.getSheets('1UKv3jbA6reYFcbDoAPOj6SbdYLINQVNL8arUHXnRR0U');
            let pertinentData = this.fetchData(ageDay, allData);
            if (pertinentData === -1)
                err.dayError(response, ageDay);
            else if (pertinentData.state && pertinentData.state !== " ")
                createResponse(pertinentData, requestOptions, response);
            else
                err.dayError(response, ageDay);
        }
    }
};

