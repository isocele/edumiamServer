var fs = require('fs');


module.exports = {


    createQuestion: function (req, res, reqOpt) {
        var name = req.query.firstName + ' ' + req.query.lastName;
        var allquestion = "";
        var file = './assets/chatbot_questions';


        /*fs.open(file, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('myfile does not exist');
                }
                throw err;
            }
            else {

            }
        });*/
        fs.readFile(file, 'utf8', async function (err, contents) {
            if (contents) {
                allquestion = contents;
                allquestion += name + ' :' + req.query.question +'\n';
                fs.writeFile(file, allquestion, function(err) {
                    if(err) {
                        res.json({
                            status: 401,
                            log: "File : " + file + " is not reachable"
                        });
                        return console.log(err);
                    }
                    res.json({
                        status: 200,
                        log: "File : " + file + " was added a new question",
                        "messages": [{
                            "text": "Vous venez de poser une question à notre équipe ! Un peu de patience, nous vous répondrons sous peu !"
                        }]
                    });
                    console.log("The file was saved!");
                });
            } else if (err)
                console.log(err);
        });
    }
};