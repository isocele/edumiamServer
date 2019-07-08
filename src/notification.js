const requestPromise = require('request-promise');
const sheets = require('./sheets');
var methods = {};

const age = require('./age.js');
const err = require('./errorHandle.js');
const rep = require('./createReplie.js');


// Affiche un block personnalisé ou un block existant dans Chatfuel
async function createResponse(pertinentData, requestOptions, response, next) {

    var jsondata;
    if (!pertinentData.blockname || pertinentData.blockname === " ") {
        let replies = await rep.createReplie(pertinentData);
        jsondata = {
            "messages":
            replies,
            "set_attributes": {
                "next": next,
            }
        };
    } else {
        jsondata = {
            "redirect_to_blocks": [pertinentData.blockname],
            "set_attributes": {
                "next": next,
            }
        };
    }
    requestPromise(requestOptions)
        .then(function () {
            response.json(jsondata);
        });
}

function nextNotif(day, data) {
    var i = 0;

    day = "" + day;
    for (; data[i].id !== day; i++);
    i++;
    for (; !data[i].state || data[i].state === " "; i++);
    return parseInt(data[i].id);
}

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
            let pertinentData = sheets.fetchData(ageDay, allData);
            console.log(ageDay);
            console.log(pertinentData);
            if (pertinentData === -1)
                err.dayError(response, ageDay);
            else if (pertinentData.state && pertinentData.state !== " ") {
                if (ageDay === 388)
                    var next = -1;
                else
                    var next = nextNotif(ageDay, allData);
                createResponse(pertinentData, requestOptions, response, next);
            }
            else
                err.dayError(response, ageDay);
        }
    }
};

