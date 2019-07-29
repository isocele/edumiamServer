const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../client_secret.json');
var SSI = "1cd8Ijy1j8kg5yHRLtECuXsr0JRLxB2iG8WBuyPPwYtw";

function writeSheets(req, hour, day) {

    const doc = new GoogleSpreadsheet(SSI);
    // Pour plus d'info se référer : https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html
    // Se connecte au Google Spreadsheets API.
    let data = doc.useServiceAccountAuth(creds, function (err) {
        // Obtiens les informations du SpreadSheets
        doc.addRow(1, {Date: day, heure: hour, prenom: req.query.lastName, nom: req.query.firstName, question: req.query.question, chatfuelID: req.query.userID}, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}


module.exports = {

    createQuestion: function (req) {
        let date = new Date();
        let hour = date.getHours() + 'h:' + date.getMinutes();
        let day = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        writeSheets(req, hour, day);
    }
};