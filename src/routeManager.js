const express = require('express');
const app = express();

const sheets = require('./spreadsheet.js');
const hubspot = require('./hubspot.js');

app.use(express.static('public'));


app.get('/api/notif', (request, response) => {
    const requestOptions = {
        uri: 'https://www.google.com/',
        headers: {
            Accept: 'application/json'
        },
        json: true
    };
    sheets.spreadSheetRoute(request, response, requestOptions);
});

app.get('/api/user', (request, response) => {
    hubspot.hubspotRoute(request, response);
});

const PORT = 8080;

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});