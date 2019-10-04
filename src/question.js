const GoogleSpreadsheet = require('google-spreadsheet');
const error = require('./errorHandle.js');
const creds = require('../client_secret.json');

var SHEETQUESTION = "1cd8Ijy1j8kg5yHRLtECuXsr0JRLxB2iG8WBuyPPwYtw";
var SHEETEMAIL = "1xrNXeA4NfG_GQT7hMSZ58MwlNgqEHbkHZ5Qm5SuGFjk";

function writeSheets(req, hour, day, res) {
    var targetSheet = "";

    //Selectionne le bon sheet correspondant au type de données envoyées
    if (req.query.question)
        targetSheet = SHEETQUESTION;
    else if (req.query.email)
        targetSheet = SHEETEMAIL;

    const doc = new GoogleSpreadsheet(targetSheet);
    // Se connecte au Google Spreadsheets API.
    let data = doc.useServiceAccountAuth(creds, function (err) {
        // Envoie les informations au Sheets

        // Pour la requête d'ajouter une question
        if (req.query.question) {
            doc.addRow(1, {
                Date: day,
                heure: hour,
                prenom: req.query.lastName,
                nom: req.query.firstName,
                question: req.query.question,
                chatfuelID: req.query.userID
            }, function (err) {
                if (err)
                    console.log(err);
            });
            error.questionReponse(res);
        }
        else if (req.query.email) { // Pour la requête d'ajouter un email de user
            doc.addRow(1, {
                Date: day,
                heure: hour,
                prenom: req.query.lastName,
                nom: req.query.firstName,
                email: req.query.email,
                chatfuelID: req.query.userID
            }, function (err) {
                if (err)
                    console.log(err);
            });
            error.emailReponse(res);

        }
    });
}

module.exports = {

    createQuestion: function (req, res) {
        // Fait une date pour la question
        let date = new Date();
        let hour = date.getHours() + 'h:' + date.getMinutes();
        let day = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        writeSheets(req, hour, day, res);
    }
};