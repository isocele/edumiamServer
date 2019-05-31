const express = require('express');
const app = express();

const notif = require('./notification.js');
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
    notif.spreadSheetRoute(request, response, requestOptions);
})

// Peut créer ou mettre à jour un profil sur Hubspot
.get('/api/user', (request, response) => {
    hubspot.hubspotRoute(request, response, requestOptions);
})

// Peut ajouter un favoris dans la DB Hubspot
.get('/api/favoris/new', (request, response) => {
    favoris.addFavorisRoute(request, response, requestOptions);
})

// Affiche les favoris présent sur Hubspot directement sur Chatfuel
.get('/api/favoris/draw', (request, response) => {
    favoris.drawFavorisRoute(request, response, requestOptions);
});


const PORT = 8080;

// ... Tout le code de gestion des routes (app.get) se trouve au-dessus

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});