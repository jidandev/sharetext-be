const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs')

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
      ca: fs.readFileSync('./ca.pem') 
    }
  });

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = db;