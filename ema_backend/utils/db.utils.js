const mysql = require('mysql2');
const dbConfig = require('../config/db.config.js');

/*
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT
});
*/

const connection = mysql.createConnection({
  //host: process.env.DB_HOST,
  //user: process.env.DB_USER,
  //password: process.env.DB_PASSWORD,
  //database: process.env.DB,
  //port: process.env.DB_PORT
  host: '127.0.0.1',
  user: 'root',
  password: 'toor',
  database: 'ema_eos'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;