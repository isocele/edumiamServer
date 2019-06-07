var fs = require('fs');

module.exports = {

    scrapfileRoute: function () {

        fs.readFile('./assets/chatbot_conv', 'utf8', function (err, contents) {
            console.log(contents);
            console.log(err);
        });
        console.log('after calling readFile');
    }

};