import { Client } from 'asana'; //Asana Integration
import express, { json as _json } from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import { hash as _hash, compare } from 'bcrypt'; //Sets up encryption hashing tools:
const saltRounds = 10;
import jsonwebtoken from 'jsonwebtoken'; //Used to access jwt tools
const {sign} = jsonwebtoken;
import { json } from 'express';
import strings from '@supercharge/strings'; //Creates random strings for tokens
import format from 'pg-format';

const PORT = 8000; //Sets up env and port

const pool = new pg.Pool({ connectionString: process.env.DB_name }); //Sets up the pool for the server
pool.connect();

//Adding Asana api Integration
const client = Client.create({
    defaultHeaders: {
      'Asana-Enable': 'new_user_task_lists,new_memberships' 
    }
  }).useAccessToken(process.env.asanaPrivateToken);
let asanaProjectId = "1203082294663367"; //Project name: Galvanize Blue Ocean Test Board

app.use(cors());
app.use(_json());

//Gets all the cohorts
app.get('/api/cohorts', (req, res) => {
    pool.query('SELECT * FROM cohorts')
    .then(result => res.send(result.rows))
    .catch(error => res.send(error))
})

//Route to select students from cohort//
app.get('/api/students/:cohort', (req, res) => {
    let cohortName = req.params.cohort
    pool.query(`SELECT * FROM students WHERE cohort_name = $1 ORDER BY name ASC`, [cohortName])
        .then(result => res.send(result.rows))
        .catch(error => res.send(error))
})

//Route selects students from list inside modal//
app.post('/api/selectedstudents', (req, res) => {
    let studentIds = req.body.studentIds
    let queryString = ''
    studentIds.forEach((studentId) => {
        if (queryString === '') {
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

//Adds a route to update users default cohort
app.patch('/api/default-cohort', (req, res) => {
    pool.query('UPDATE users SET default_cohort = $1 WHERE username = $2 RETURNING default_cohort', [req.body.default_cohort, req.body.username])
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
    const random = strings.random(25)
    const user = req.body
    //Creates an account specific json web token using username and a random string
    const accountToken = sign({ id: user.username }, random)
    //Creates a random string to be updated each time user signs in
    //First created token is a place holder
    const sessionToken = strings.random(30)
    //hashes the input password to be stored securely
    _hash(user.password, saltRounds, (err, hash) => {
        //The password is hashed now and can be stored with the hash parameter
        pool.query('INSERT INTO users (username, password, token, session_token) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING RETURNING *',
            [user.username, hash, accountToken, sessionToken])
            //Checks to see what was returned
            //If a account already exists it sends back result.rows with a length of zero
            //If account was created it sends back the account info
            .then(result => {
                result.rows.length === 0 ?
                    res.status(409).send([{ result: 'false' }]) : res.status(201).send([{ result: 'true' }])
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
            if (data.rows.length === 0) {
                res.send([{ response: 'Incorrect Username' }])
            } else {
                //If username matches it does a bcrypt compare to check if the password is correct
                compare(password, data.rows[0].password, function (err, result) {
                    //If passowrd is correct it sends the users information
                    result == true ?
                        res.send([{ username: data.rows[0].username, cohort: data.rows[0].default_cohort, userToken: data.rows[0].token, sessionToken: data.rows[0].session_token, asanaToken: data.rows[0].asana_access_token }]) :
                        res.send([{ response: 'false' }])
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
                res.status(200).send([{ response: 'true' }])
                :
                res.status(401).send([{ response: 'false' }])
        })
        .catch(error => res.status(404).send(error))
})

//Route to update users session token on login
//Takes place after successful password authentication
app.patch('/api/token', (req, res) => {
    const user = req.body.username
    //Creates a random string for the session token
    const sessionToken = strings.random(30)
    //Updates the current session token with the new one and returns new token
    pool.query('UPDATE users SET session_token = $1 WHERE username = $2 RETURNING session_token', [sessionToken, user])
        .then(result => res.status(200).send(result.rows))
        .catch(error => res.status(404).send(error))
})


// route for creating new cohort
app.post(`/api/create/cohort`, (req, res) => {
    // gets cohort object from body
    const newCohort = req.body.newCohort
    // updates cohort table inside database
    pool.query(`INSERT INTO cohorts (cohort_name, begin_date, end_date, instructor) VALUES ($1, $2, $3, $4) RETURNING *`, [newCohort.name, newCohort.begin_date, newCohort.end_date, newCohort.instructor])
        .then(result => res.status(200).send(result.rows))
        .catch(error => res.status(404).send(error))
})

// route for getting all learn assessment names
app.get(`/api/learn/assessment-names`, (req, res) => {
    pool.query(` SELECT * FROM learn;`)
        .then(result => res.status(200).send(result.rows))
        .catch(error => res.status(404).send(error))
})

// route for getting all project names
app.get(`/api/projects/project-names`, (req, res) => {
    pool.query(` SELECT * FROM projects;`)
        .then(result => res.status(200).send(result.rows))
        .catch(error => res.status(404).send(error))
})

// route to post the learn grates for selected users
app.post(`/api/learn/grades-update`, (req, res) => {
    //gets information from the body
    console.log(req.body)
    let student_id = req.body.student_id
    let assessment_id = req.body.assessment_id
    let assessment_grade = req.body.assessment_grade
    //updates the learn_grades table in the database
    pool.query(`INSERT INTO learn_grades (student_id, assessment_id, assessment_grade) VALUES ($1, $2, $3);`, [student_id, assessment_id, assessment_grade])
        .then(result => {
            console.log("Inside Asana **********************");
            //const client = Client.create().useAccessToken(process.env.asanaPrivateToken);
            //Create a sub task
            client.tasks.createSubtaskForTask(1204083444763917, {name: "React Assessment 250%", pretty: true})
                .then((result) => {
                    console.log(result);
                });
        })    
        .then(result => res.status(200).send(result.rows))
        .catch(error => res.status(404).send(error))
})

/****************************** ROUTES FOR WEEKLY UPDATE MODAL ******************************/

//Route that updates the student_teamwork_skills table with the tech scores for a group of students
app.post(`/api/weekly-update/tech-skills`, (req, res) => {
    const students = req.body.students
    let record_date = new Date().toISOString()
    let values = []
    students.forEach((student) => values.push([student.student_id, student.score, record_date]))
    pool.query(format('INSERT INTO student_tech_skills (student_id, score, record_date) VALUES %L', values), [])
    .then(result => res.status(200).send(result.rows))
    .catch(error => res.status(404).send(error))
})

//Route that updates the notes table with the weekly notes for a group of students
// needs student_id, notes, name from body
//http://localhost:8000/api/weekly-update/notes
// app.post(`/api/weekly-update/notes`, (req, res) => {
//     const students = req.body
//     // let record_date = new Date().toISOString()
//     console.log("students body ",students)
//     let values = []
//     values.push([students.student_id, students.notes, students.record_date])
//     //students.forEach((student) => values.push([student.student_id, student.notes, student.record_date]))
//     pool.query(format('INSERT INTO notes(student_id, notes, note_date) VALUES %L', values), [])
//     .then((result) => {
//         console.log(result);
//         console.log(values);
//         res.status(200).send(result.rows)
//     })
//     .catch(error => res.status(404).send(error))
// })

//Route updates the student_teamwork_skills table with the team scores for a group of students
app.post(`/api/weekly-update/teamwork-skills`, (req, res) => {
    const students = req.body.students
    let record_date = new Date().toISOString()
    let values = []
    students.forEach((student) => values.push([student.student_id, student.score, record_date]))
    pool.query(format('INSERT INTO student_teamwork_skills (student_id, score, record_date) VALUES %L', values), [])
    .then(result => res.status(200).send(result.rows)) 
    .catch(error => res.status(404).send(error))
})

////////////////////////////////////////ROUTES FOR ASSESSMENT MODAL////////////////////////////////////////
//Route posts the learn_grades table with the assessment grades for a group of students
app.post(`/api/application-update/learn-grades-post`, (req, res) => {
    const students = req.body.students //[ { student_id: '1', assessment_id: 2, assessment_grade: 20 } ]
    let values = []
    students.forEach((student) => {
        values.push([student.student_id, student.assessment_id, student.assessment_grade]) //pushes request body to values array for each student
    })
    Promise.all(students.map((student)=>{
        pool.query(format('INSERT INTO learn_grades (student_id, assessment_id, assessment_grade) VALUES %L ON CONFLICT (student_id, assessment_id) DO UPDATE SET assessment_grade = excluded.assessment_grade', values ), [])
        .then((result) => { res.status(200).send(result.rows) })
        .catch((err) => console.error(err))
        .then(()=>{
            //after new record is inserted in the db, we need asana task id and assessment name to create a sub task
            return pool.query(`select students.asana_task_id as asana_task_id,learn_grades.student_id as student_id, learn_grades.assessment_id as assessment_id, learn.assessment_name as assessment_name, learn_grades.assessment_grade as assessment_grade
            from learn_grades
                join students on learn_grades.student_id = students.student_id
                join learn on learn_grades.assessment_id = learn.assessment_id
            where learn_grades.student_id = $1`, [student.student_id]);
        })
        .catch((err) => console.error(err))
        .then((result) => {
            let lastElement = result.rows.length - 1;
            //Create a sub task in Asana in this format: Assessment Name: Assessment Grade
            return client.tasks.createSubtaskForTask(result.rows[lastElement].asana_task_id, {name: `${result.rows[lastElement].assessment_name}: ${student.assessment_grade}`, pretty: true})
        })
        .catch((err) => console.error(err))
        .then((result) => {
            let asanaSubTaskId = result.gid; //this stores the sub task id after it is created above
            pool.query(format(`UPDATE learn_grades set asanasubtaskid = ${asanaSubTaskId} where assessment_id = ${student.assessment_id} AND assessment_grade = ${student.assessment_grade}`))
            return {...student, subTaskId: result.gid} //returns each student object from body, and adds taskId to that student object
        })
    })) 
})

//Route updates the learn_grades table with the assessment grades for a group of students
app.post(`/api/application-update/learn-grades-update`, (req, res) => {
    const students = req.body.students
    let values = []
    students.forEach((student) => {
        values.push([student.student_id, student.assessment_id, student.assessment_grade]) //pushes request body to values array for each student
    })
    Promise.all(students.map((student) => {
        pool.query(format(`UPDATE learn_grades SET assessment_grade = %s WHERE student_id = %s AND assessment_id = %s;`, student.assessment_grade, student.student_id, student.assessment_id))
        .then((result)=>{
            return pool.query(`select learn_grades.asanasubtaskid as subtask_id, learn_grades.assessment_id as assessment_id, learn.assessment_name as assessment_name, learn_grades.assessment_grade as assessment_grade
                from learn_grades
                    join learn on learn_grades.assessment_id = learn.assessment_id
                where
                    learn_grades.assessment_id = ${student.assessment_id} AND learn_grades.assessment_grade = ${student.assessment_grade} AND learn_grades.student_id = ${student.student_id}`);
        })
        .then((result)=>{ //this result will display the result of above select query. It will display subtask_id, assessment_id, assessment_name, assessment_grade which we need to update sub task in asana
            let subtask_id = result.rows[0].subtask_id;
            let assessment_name = result.rows[0].assessment_name;
            let assessment_grade = result.rows[0].assessment_grade;
            //after the assessment grade is updated in the db, we need asana_subtask_id, assessment_name, assessment_grade to update the sub task 
            client.tasks.updateTask(subtask_id, {name: `${assessment_name}: ${assessment_grade}`, pretty: true})
            .then(() => {});
        })
        .catch((err) => console.error(err))
    }))
})

//Route selects all from learn_grades table
app.get(`/api/learn-grades`, (req, res) => {
    pool.query(`SELECT * FROM learn_grades;`)
    .then(result => res.status(200).send(result.rows)) 
    .catch(error => res.status(404).send(error))
})

////////////////////////////////////////ROUTES FOR PROJECT MODAL////////////////////////////////////////

//Route posts the project_grades table with the project grades for a group of students
app.post(`/api/application-update/project-grades-post`, (req, res) => {
    const students = req.body.students
    let values = []
    students.forEach((student) => values.push([student.student_id, student.project_id, student.project_passed]))
    pool.query(format('INSERT INTO project_grades (student_id, project_id, project_passed) VALUES %L', values), [])
    .then(result => res.status(200).send(result.rows)) 
    .catch(error => res.status(404).send(error))
})

//Route updates the project_grades table with the project grades for a group of students
app.post(`/api/application-update/project-grades-update`, (req, res) => {
    const students = req.body.students
    const promises = students.map(student => {
        const studentId = student.student_id
        const projectId = student.project_id
        const projectPassed = student.project_passed
        return pool.query(format(`UPDATE project_grades SET project_passed = %L WHERE student_id = %s AND project_id = %s;`, projectPassed, studentId, projectId)) 
      })
      Promise.all(promises)
    .then(result => res.status(200).send(result)) 
    .catch(error => {
        res.status(404).send(error)
        console.log(error)
    })
})

//Route selects all from the project)grades table
app.get(`/api/project-grades`, (req, res) => {
    pool.query(`SELECT * FROM project_grades;`)
    .then(result => res.status(200).send(result.rows)) 
    .catch(error => res.status(404).send(error))
})

//Creates a route to insert multiple students into a cohort
//This also creates a task for those students in Asana board
app.post('/api/create/students', (req, res) => {
    const students = req.body.students;
    Promise.all(students.map((student) => {
       return client.tasks.createTask({projects: [asanaProjectId], name: `${student.name}`, pretty: true}) //creates Task in Asana Project, asanaProjectId is a variable that stores project GID from Asana
        .then((result) => {
            return {...student, taskId: result.gid} //returns each student object from body, and adds taskId to that student object
        })
        .catch((err) => console.error(err));
    }))
    .then((students)=> {
        const values = students.map((student)=>{
            return [student.name, student.cohort_name, student.github, student.taskId];
        })
        pool.query(format('INSERT INTO students (name, cohort_name, github, asana_task_id) VALUES %L RETURNING *', values), [])
        .then(result => res.send(result.rows))
        .catch(error => res.send(error))
    })
})

app.get('/api/student/scores/:id', (req, res) => {
    let studentId = req.params.id
    pool.query(`SELECT *
                FROM students
                RIGHT JOIN project_grades
                ON students.student_id = project_grades.student_id 
                AND students.student_id=$1
                JOIN projects
                ON project_grades.project_id = projects.project_id`, [studentId])
      .then(result => res.status(200).send(result.rows))
      .catch(error => {
        console.log("error",error)
        res.status(404).send(error)
      })
  })

  app.get('/api/student/learn/scores/:id', (req, res) => {
    let studentId = req.params.id
    pool.query(`SELECT *
                FROM learn_grades
                RIGHT JOIN learn
                ON learn_grades.assessment_id=learn.assessment_id
                WHERE learn_grades.student_id=$1`, [studentId])
      .then(result => res.status(200).send(result.rows))
      .catch(error => {
        console.log(error)
        res.status(404).send(error)
      })
  })

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});