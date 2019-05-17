const express = require('express');
const app = express();

const sheets = require('./spreadsheet.js');
const hubspot = require('./hubspot.js');
const favoris = require('./favoris.js');

app.use(express.static('public'));


// All the different API of the server

// Return a block directly draw on chatfuel
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

// Can create or update a user
app.get('/api/user', (request, response) => {
    hubspot.hubspotRoute(request, response);
});

// Can add favoris
app.get('/api/favoris/new', (request, response) => {
    favoris.addFavorisRoute(request, response);
});


const PORT = 8080;

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});