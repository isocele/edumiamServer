const express = require('express');
const app = express();

const sheets = require('./spreadsheet.js')


app.use(express.static('public'));


app.get('/api', (request, response) => {
    const requestOptions = {
        uri: 'https://icanhazdadjoke.com/',
        headers: {
            Accept: 'application/json'
        },
        json: true
    };
    sheets.spreadSheetRoute(request, response, requestOptions);
});

const PORT = 8000;

// listen for requests
app.listen(PORT, function () {
    console.log('Your app is listening on port ' + PORT);
});