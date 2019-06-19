const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../client_secret.json');
const delay = require('delay');

module.exports = {
    getSheets: async function (url) {
        // Ouvre ou créer un document GoogleSheets selon l'url
        const doc = new GoogleSpreadsheet(url);
        let data = [];

        // Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html
        // Se connecte au Google Spreadsheets API.
        data = doc.useServiceAccountAuth(creds, function (err) {
            // Obtiens les informations du SpreadSheets
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

    // Trouve la colonne du tableau <data> correspondant avec l'<id> (jour cummulé ou id favoris, fiche...)
    fetchData: function (id, data) {
        //Je transforme l'id en string pour être sur de la façon dont je dois la manipuler
        id = "" + id;
        for (let i = 0; i < data.length; i++) {
            // console.log(id, data[i].id)
            if (data[i].id === id) {
                return (data[i])
            }
        }
        // Gestion des exeptions plus vieux ou plus jeune que prévus
        if (id > 1095)
            return (data[1096]);
        else if (id < 0)
            return (data[-1]);
        return (-1);
    }
};