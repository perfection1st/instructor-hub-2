//Sets up requires that the server needs
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

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
    connectionString: process.env.PG_CONNECT
});
pool.connect();

app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM cohorts')
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});