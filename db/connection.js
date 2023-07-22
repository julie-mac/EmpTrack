require('dotenv').config();
const mysql = require('mysql2');

//Establishes connection to MySQL database
const db = mysql.createConnection(
    {
      //Can switch the host to 'localhost', but for whatever reason that doesn't work on my computer
      host: '127.0.0.1', 

      //username and password are stored in a .env file, and are therefore hidden
      user: process.env.db_user,
      
      password: process.env.db_password, 

      database: 'empdirectory_db'
    },
    console.log(`Connected to the empdirectory_db database.`)
  );

module.exports = db;