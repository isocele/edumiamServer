const requestPromise = require('request-promise');
const sheets = require('./sheets');
var methods = {};

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');


// Affiche un block personnalisé ou un block existant dans Chatfuel
async function createResponse(pertinentData, requestOptions, response) {
    var jsondata;

    // console.log(pertinentData.idcontent);
    // sauvegarde l'id du block suivant
/*    if (pertinentData.idcontent && pertinentData.idcontent !== " ")
        var tmpid = pertinentData.idcontent;
    console.log(tmpid);
    if (tmpid || pertinentData.blockstick) {
        // Prends les info du sheets "Content"
        let allData = await sheets.getSheets('1YF2SIYmIQgSNKl_WLzVa2dM5imDD0S4byTthX_QPzC4');

        var id = tmpid || pertinentData.blockstick;
        pertinentData = sheets.fetchData(id, allData, 'standard');
        console.log(pertinentData);
        let replies = await rep.createReplie(pertinentData);
        if (!pertinentData.time)
            id = 0;
        jsondata = {
            "messages":
            replies,
            "set_attributes": {
                "next": id,
                "typing": pertinentData.time
            }
        };
    } else */if (!pertinentData.blockname || pertinentData.blockname === " ") {
        let replies = await rep.createReplie(pertinentData);
        jsondata = {
            "messages":
            replies,
            "set_attributes": {
                "next": 0,
            }
        };
    } else {
        jsondata = {
            "redirect_to_blocks": [pertinentData.blockname],
            "set_attributes": {
                "next": 0,
            }
        };
    }
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

    spreadSheetRoute: async function (request, response, requestOptions) {
        var ageDay = age.findAge(request.query.babybirth);

        // var ageDay = request.query.babybirth;
        if (ageDay === "error")
            err.ageError(response);
        else {
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

    contentRoute: async function (request, response, requestOptions) {
        let allData = await sheets.getSheets('1YF2SIYmIQgSNKl_WLzVa2dM5imDD0S4byTthX_QPzC4');
        let pertinentData = sheets.fetchData(request.query.content, allData, 'notification');

        // console.log(pertinentData);
        if (pertinentData === -1)
            err.dayError(response, );
        else if (pertinentData.state && pertinentData.state !== " ") {
            createResponse(pertinentData, requestOptions, response, "kkk");
        }
        else
            err.dayError(response, ageDay);
    }
};

