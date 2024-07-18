const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

require('dotenv').config();

const app = express();

// Set up session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Set to true if using HTTPS
}));

// Set up CORS to allow requests from frontend
const corsOptions = {
  origin: ['https://localhost:3030', 'https://127.0.0.1:3030'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
require('./routes/products.routes.js')(app);
require('./routes/users.routes.js')(app);
require('./routes/chatbot.routes.js')(app);
// require('./routes/download.routes.js')(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes and serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
