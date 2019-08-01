/*
Ce fichier gére les requètes d'affichage de block
*/

const requestPromise = require('request-promise');
const sheets = require('./sheets');

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');


// Affiche un block personnalisé avec les infos des sheets ou un block existant dans Chatfuel
async function createResponse(pertinentData, requestOptions, response, state) {
    var jsondata;

    // Sauvegarde l'id du block suivant
    if (pertinentData.idcontent && pertinentData.idcontent !== " ")
        var tmpid = pertinentData.idcontent;

    // Créer un block via les infos des google Sheets
    if (tmpid || pertinentData.blockstick) {

        // Prends les info du sheets "Content"
        var id = tmpid || pertinentData.blockstick;
        if (!state) {
            let allData = await sheets.getSheets('1YF2SIYmIQgSNKl_WLzVa2dM5imDD0S4byTthX_QPzC4');
            pertinentData = await sheets.fetchData(id, allData, 'standard');
        }
        let replies = await rep.createReplie(pertinentData);

        // Si aucune valeur n'est mis sur time => next doit valoir 0 (chatfuel ne fera pas d'autres requêtes)
        if (!pertinentData.time)
            id = 0;

        // Construit la réponse pour afficher le block via chatfuel
        jsondata = {
            "messages":
            replies,
            "set_attributes": {
                "next": id,
                "typing": pertinentData.time
            }
        };
    } else if (!pertinentData.blockname || pertinentData.blockname === " ") {
        let replies = await rep.createReplie(pertinentData);
        // Construit la réponse pour afficher le block via chatfuel
        jsondata = {
            "messages":
            replies,
            "set_attributes": {
                "next": 0,
            }
        };
    } else {
        // Construit la réponse pour afficher le block via chatfuel
        jsondata = {
            "redirect_to_blocks": [pertinentData.blockname],
            "set_attributes": {
                "next": 0,
            }
        };
    }

    // Envoie la réponse
    requestPromise(requestOptions)
        .then(function () {
            response.json(jsondata);
        });
}
/*
function nextNotif(day, data) {
    var i = 0;

    day = "" + day;
    for (; data[i].id !== day; i++);
    i++;
    for (; !data[i].state || data[i].state === " "; i++);
    return parseInt(data[i].id);
}*/

module.exports = {

    // Gére les requêtes pour les notifications
    spreadSheetRoute: async function (request, response, requestOptions) {
        var ageDay = age.findAge(request.query.babybirth);

        if (ageDay === "error")
            err.ageError(response);
        else {
            // Va chercher les informations du Sheets des notifications
            let allData = await sheets.getSheets('1UKv3jbA6reYFcbDoAPOj6SbdYLINQVNL8arUHXnRR0U');
            if (ageDay < -1)
                ageDay = -1;
            let pertinentData = sheets.fetchData(ageDay, allData, 'notification');
            if (pertinentData === -1)
                err.dayError(response, ageDay);
            else if (pertinentData.state && pertinentData.state !== " ") {
                // if (ageDay === 388)
                //     var next = -1;
                // else
                //     var next = nextNotif(ageDay, allData);
                createResponse(pertinentData, requestOptions, response);
            }
            else
                err.dayError(response, ageDay);
        }
    },

    // Gére les requêtes pour afficher du contenus standard
    contentRoute: async function (request, response, requestOptions) {
        // Va chercher les informations du Sheets des notifications
        let allData = await sheets.getSheets('1YF2SIYmIQgSNKl_WLzVa2dM5imDD0S4byTthX_QPzC4');
        let pertinentData = sheets.fetchData(request.query.content, allData, 'notification');

        if (pertinentData === -1)
            err.dayError(response, );
        else if (pertinentData.state && pertinentData.state !== " ") {
            createResponse(pertinentData, requestOptions, response, "final");
        }
        else
            err.dayError(response, pertinentData.id);
    }
};

