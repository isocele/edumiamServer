const express = require('express');
const app = express();

const sheets = require('./spreadsheet.js');
const hubspot = require('./hubspot.js');
const favoris = require('./favoris.js');

const requestOptions = {
    uri: 'https://www.google.com/',
    headers: {
        Accept: 'application/json'
    },
    json: true
};

app.use(express.static('public'));


// Toute les routes pour les différentes requètes

// Retourne un block affiché directement sur chatfuel
app.get('/api/notif', (request, response) => {

    sheets.spreadSheetRoute(request, response, requestOptions);
});

// Peut créer ou mettre à jour un profil sur Hubspot
app.get('/api/user', (request, response) => {
    hubspot.hubspotRoute(request, response, requestOptions);
});

// Peut ajouter un favoris dans la DB Hubspot
app.get('/api/favoris/new', (request, response) => {
    favoris.addFavorisRoute(request, response, requestOptions);
});

// Affiche les favoris présent sur Hubspot directement sur Chatfuel
app.get('/api/favoris/draw', (request, response) => {
    favoris.drawFavorisRoute(request, response, requestOptions);
});


const PORT = 8080;

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});