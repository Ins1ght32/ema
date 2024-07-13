module.exports = app => {
    const chatbot = require("../controllers/chatbot.controller.js");

    app.post("/queryChatbot", chatbot.queryFlask);

};