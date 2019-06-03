const express = require('express');
const app = express();

const notif = require('./notification.js');
const hubspot = require('./hubspot.js');
const favoris = require('./favoris.js');
const err = require('./errorHandle');

const requestOptions = {
    uri: 'https://www.google.com/',
    headers: {
        Accept: 'application/json'
    },
    json: true
};

app.use(express.static('public'));
err.initError(requestOptions);

// Toute les routes pour les différentes requètes

// Retourne un block affiché directement sur chatfuel
app.get('/api/notif', (request, response) => {
    console.log("!-- Requéte pour trouver la notification adéquate");
    notif.spreadSheetRoute(request, response, requestOptions);
})

// Peut créer ou mettre à jour un profil sur Hubspot
.get('/api/user', (request, response) => {
    console.log("!-- Requéte pour mettre à jour l'utilisateur");
    hubspot.hubspotRoute(request, response, requestOptions);
})

// Peut ajouter un favoris dans la DB Hubspot
.get('/api/favoris/new', (request, response) => {
    console.log("!-- Requéte pour ajouter un favoris");
    favoris.addFavorisRoute(request, response, requestOptions);
})

// Affiche les favoris présent sur Hubspot directement sur Chatfuel
.get('/api/favoris/draw', (request, response) => {
    console.log("!-- Requéte pour affciher les favoris");
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