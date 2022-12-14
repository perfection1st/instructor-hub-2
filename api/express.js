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

//Creates random strings for tokens
const Str = require('@supercharge/strings')

//Sets up env and port
const PORT = 8000;

//Sets up the pool for the server
const pool = new Pool({
    connectionString: process.env.PG_CONNECT
});
pool.connect();

app.use(cors());
app.use(express.json());

//Route to get all users
app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM cohorts')
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

//Route to create a new user
app.post('/api/create/user', (req, res) => {
    //Creates a random string with 25 different characters
    const random = Str.random(25)
    const user = req.body
    //Creates an account specific json web token using username and a random string
    const accountToken = jwt.sign({id: user.username}, random)
    //Creates a random string to be updated each time user signs in
    //First created token is a place holder
    const sessionToken = Str.random(30)
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});