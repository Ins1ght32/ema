const Chatbot = require('../models/chatbot.model.js');

exports.queryFlask = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;
    let responseSent = false;
    console.log("Received this prompt: ", requestBody);

    Chatbot.queryFlask(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            if (!responseSent) {
                res.status(500).send({
                    message: 'Error occured'
                });
                responseSent = true;
            }
            
        }

        else if (data) {
            console.log(data);
            if (!responseSent) {
                res.json(data);
                responseSent = true;
            }
            // res.json(data);
        }
    });
};
