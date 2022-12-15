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

//Sets up env and port
const PORT = 8000;

//Sets up the pool for the server
const pool = new Pool({
    connectionString: process.env.PG_CONNECT
});
pool.connect();

app.use(cors());
app.use(express.json());

//Route to select students from cohort//
app.get('/api/students/:id', (req, res) => {
    cohortId = req.params.id
    pool.query(`SELECT * FROM students WHERE cohort_id = $1`, [cohortId])
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

//Route selects students from list inside modal//
app.get('/api/selectedstudents', (req, res) => {
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

// app.update('/api/students/update', (req, res) => {
//     studentIds = req.body.studentIds
//     techApt = req.body.te
//     pool.query(`SELECT * FROM students WHERE cohort_id = $1`, [cohortId])
//     .then(result => res.send(result.rows))
//     .catch(error => res.send(error))
// })

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});