const authMiddleware = require("../middleware/auth.middleware.js");

module.exports = app => {
    const chatbot = require("../controllers/chatbot.controller.js");

    app.post("/queryChatbot", authMiddleware.ensureLoggedIn, chatbot.queryFlask);

    app.get("/getCSRFToken", chatbot.getCSRFToken);

};