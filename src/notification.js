const requestPromise = require('request-promise');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./../client_secret.json');
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
}

module.exports = {

    // Trouve la colonne du tableau correspondant avec l'id (jour cummulé ou id favoris)
    fetchData: function (id, data) {
    console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (parseInt(data[i].id, 10) === id) {
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

    getSheetsData: async function (url) {
        const doc = new GoogleSpreadsheet(url);
        let data = [];

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
            //console.log(error);
            return (data)
        }

    },

    spreadSheetRoute: async function (request, response, requestOptions) {

        var ageDay = age.findAge(request.query.birth);
        if (ageDay === -1)
            err.ageError(requestOptions, response);
        else {
            // Ouvre ou créer un document GoogleSheets selon l'url
            console.log(ageDay);
            // Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html
            let allData = await this.getSheetsData('1K2kx6gJ5Ygmy4Jyp8XO7HMXWfN34Psf2ibKsu0EhQaQ');
            let pertinentData = this.fetchData(ageDay, allData);
            if (pertinentData === -1)
                err.dayError(requestOptions, response);
            else if (pertinentData.state && pertinentData.state !== " ")
                createResponse(pertinentData, requestOptions, response);
            else
                err.dayError(requestOptions, response);
        }
    }
};

