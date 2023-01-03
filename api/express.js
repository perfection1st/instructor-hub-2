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
const { json } = require('express');

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

app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM users')
    .then(result => res.send(result.rows))
    .catch((error) => res.send(error))
})

//Route to select students from cohort//
app.get('/api/students/:cohort', (req, res) => {
    cohortName = req.params.cohort
    pool.query(`SELECT * FROM students WHERE cohort_name = $1`, [cohortName])
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

//Route selects students from list inside modal//
app.post('/api/selectedstudents', (req, res) => {
    studentIds = req.body.studentIds
    queryString = ''
    studentIds.forEach((studentId) => {
        if (queryString === ''){
            queryString = queryString + `${studentId}`
        }
        else {
            queryString = queryString + ", " + `${studentId}`
        }
    })
    console.log(queryString)
    pool.query(`SELECT * FROM students WHERE student_id in (${queryString})`)
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

//Call to get users default cohort data
//Pseudo code:
//SELECT * FROM variable cohort name RIGHT OUTER JOIN students where cohorit_id = cohort_id

// app.update('/api/students/update', (req, res) => {
//     studentIds = req.body.studentIds
//     techApt = req.body.te
//     pool.query(`SELECT * FROM students WHERE cohort_id = $1`, [cohortId])
//     .then(result => res.send(result.rows))
//     .catch(error => res.send(error))
// })

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
    //hashes the input password to be stored securely
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        //The password is hashed now and can be stored with the hash parameter
        pool.query('INSERT INTO users (username, password, asana_access_token, token, session_token) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO NOTHING RETURNING *',
        [user.username, hash, user.asana_access_token, accountToken, sessionToken])
        //Checks to see what was returned
        //If a account already exists it sends back result.rows with a length of zero
        //If account was created it sends back the account info
        .then(result => {
            result.rows.length === 0 ? 
            res.status(409).send([{result: 'false'}]) : res.status(201).send([{result: 'true'}])
        })
        .catch(error => res.status(400).send(error))
    })
})

//Route handler for user login
app.post('/api/login', (req, res) => {
    const user = req.body.username
    const password = req.body.password
    pool.query('SELECT * FROM users WHERE username = $1', [user])
    //Checks to see if the username matches stored username
    .then(data => {
        //If username doesn't match a stored username it sends back Incorrect Username
        if(data.rows.length === 0){
            res.send([{response: 'Incorrect Username'}])
        } else {
            //If username matches it does a bcrypt compare to check if the password is correct
            bcrypt.compare(password, data.rows[0].password, function(err, result){
                //If passowrd is correct it sends the users information
                result == true ?
                res.send([{username: data.rows[0].username, cohort: data.rows[0].default_cohort, userToken: data.rows[0].token, sessionToken: data.rows[0].session_token, asanaToken: data.rows[0].asana_access_token}]) :
                res.send([{response: 'false'}])
            })
        }
    })
})

//Route to verify the user logging in
app.post('/api/authent', (req, res) => {
    //Access the request body that is sent with the fetch
    const user = req.body.username
    const userToken = req.body.userToken
    const sessionToken = req.body.sessionToken
    //Accesses the tokens from the user sent with username
    pool.query('SELECT token, session_token FROM users WHERE username = $1', [user])
    .then(result => {
        //Compares the stored tokens with sent token and sends a response based on result
        userToken == result.rows[0].token && sessionToken == result.rows[0].session_token ?
            res.status(200).send([{response: 'true'}])
            :
            res.status(401).send([{response: 'false'}])
    })
    .catch(error => res.status(404).send(error))
})

//Route to update users session token on login
//Takes place after successful password authentication
app.patch('/api/token', (req, res) => {
    const user = req.body.username
    //Creates a random string for the session token
    const sessionToken = Str.random(30)
    //Updates the current session token with the new one and returns new token
    pool.query('UPDATE users SET session_token = $1 WHERE username = $2 RETURNING session_token', [sessionToken, user])
    .then(result => res.status(200).send(result.rows))
    .catch(error => res.status(404).send(error))
})


// route for creating new cohort
app.post(`/api/create/cohort`, (req, res) => {
    // gets cohort object from body
    console.log(req.body)
    const newCohort = req.body.newCohort
    // updates cohort table inside database
    pool.query(`INSERT INTO cohorts (cohort_name, begin_date, end_date, instructor, gid) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [newCohort.name, newCohort.begin_date, newCohort.end_date, newCohort.instructor, newCohort.gid])
    .then(result => res.status(200).send(result.rows))
    .catch(error => res.status(404).send(error))
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});