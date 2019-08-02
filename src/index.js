/*
Ce fichier gére toutes les routes des API que le serveur propose ainsi que l'adresse du serveur.
*/

const express = require('express');
const app = express();

const notif = require('./notification');
const hubspot = require('./hubspot');
const favoris = require('./favoris');
const err = require('./errorHandle');
const age = require('./age');
const scrap = require('./scrapFile');
const question = require('./question');

const requestOptions = {
    uri: 'https://www.google.com/',
    headers: {
        Accept: 'application/json'
    },
    json: true
};

app.use(express.static('public'));

err.initError(requestOptions);

// Toutes les routes pour les différentes requètes

// Retourne un block de notif et l'affiche directement sur chatfuel
app.get('/api/notif', (request, response) => {
    console.log("!-- Requéte pour trouver la notification adéquate");
    notif.spreadSheetRoute(request, response, requestOptions);
})

    // Retourne un block ne venant pas d'une notif
    .get('/api/content', (request, response) => {
        console.log("!-- Requéte pour afficher du contenu");
        notif.contentRoute(request, response, requestOptions);
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
        console.log("!-- Requéte pour afficher les favoris");
        favoris.drawFavorisRoute(request, response, requestOptions);
    })

    // Supprime un favoris des informations du contacts dans Hubspot
    .get('/api/favoris/delete', (request, response) => {
        console.log("!-- Requéte pour supprimer un favoris");
        favoris.deleteFavorisRoute(request, response, requestOptions);
    })

    // Créer ou maj le "mois" sur Chatfuel (nbr de mois de l'enfant) à partir de la date
    .get('/api/getmonth', (request, response) => {
        console.log("!-- Requéte pour obtenir le mois de l'enfant");
        age.returnMonth(request, response, requestOptions);
    })

    // Envoie tous les messages passant par le default message de chatfuel dans un google sheets
    .get('/api/question', (request, response) => {
        console.log("!-- Requéte pour enregistrer une question");
        question.createQuestion(request, response, requestOptions);
    });

    // Parse le fichier ./assets/chatbot_conv -> N'est plus utilisé !!
/*    .get('/scrap', (request, response) => {
       console.log("!-- Requéte pour réécrire un fichier sur un sheets");
        scrap.scrapfileRoute(response, requestOptions);
    });*/

const PORT = 8080;

// Message d'erreur pour les mauvaises requêtes via navigateur
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});
