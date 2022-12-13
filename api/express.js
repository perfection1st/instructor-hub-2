//Sets up requires that the server needs
const express = require('express');
const app = express();
const cors = require('cors');

const {Pool} = require('pg');

//Sets up encryption hashing tools:
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Used to access jwt tools
const jwt = require('jsonwebtoken');

//Sets up env and port
const PORT = 8000;

//Sets up the pool for the server
const pool = new Pool({
    connectionString: process.env.PGCONNECT
});
pool.connect();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});