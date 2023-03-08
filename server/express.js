import { Client } from "asana"; //Asana Integration
import express, { json as _json } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
import { hash as _hash, compare } from "bcrypt"; //Sets up encryption hashing tools:
const saltRounds = 10;
import jsonwebtoken from "jsonwebtoken"; //Used to access jwt tools
const { sign } = jsonwebtoken;
import { json } from "express";
import strings from "@supercharge/strings"; //Creates random strings for tokens
import format from "pg-format";

const PORT = 8000; //Sets up env and port

const pool = new pg.Pool({ connectionString: process.env.DB_name }); //Sets up the pool for the server
pool.connect();

//Adding Asana Integration
//let asanaPrivateToken = "1/1204033748668812:a2f332ccb5e2b3e415e1676d794b5563";
const client = Client.create().useAccessToken(process.env.asanaPrivateToken);
let asanaProjectId = "1203082294663367"; //Project name: Galvanize Blue Ocean Test Board
let asanaSectionId = "1204041854702376"; //Section name: Students

app.use(cors());
app.use(_json());

//Gets all the cohorts
app.get("/api/cohorts", (req, res) => {
  pool
    .query("SELECT * FROM cohorts")
    .then((result) => res.send(result.rows))
    .catch((error) => res.send(error));
});

//Route to select students from cohort//
app.get("/api/students/:cohort", (req, res) => {
  let cohortName = req.params.cohort;
  pool
    .query(`SELECT * FROM students WHERE cohort_name = $1 ORDER BY name ASC`, [cohortName])
    .then((result) => res.send(result.rows))
    .catch((error) => res.send(error));
});

//Route selects students from list inside modal//
app.post("/api/selectedstudents", (req, res) => {
  let studentIds = req.body.studentIds;
  let queryString = "";
  studentIds.forEach((studentId) => {
    if (queryString === "") {
      queryString = queryString + `${studentId}`;
    } else {
      queryString = queryString + ", " + `${studentId}`;
    }
  });
  console.log(queryString);
  pool
    .query(`SELECT * FROM students WHERE student_id in (${queryString})`)
    .then((result) => res.send(result.rows))
    .catch((error) => res.send(error));
});

//Adds a route to update users default cohort
app.patch("/api/default-cohort", (req, res) => {
  pool
    .query("UPDATE users SET default_cohort = $1 WHERE username = $2 RETURNING default_cohort", [
      req.body.default_cohort,
      req.body.username,
    ])
    .then((result) => res.send(result.rows))
    .catch((error) => res.send(error));
});

// Route to post randomly generated groups
app.post("/api/post-groups", async (req, res) => {
  const { groups, currentCohort } = req.body;
  const cohortArr = [];
  const groupIdArr = [];
  // this creates an array with length = the number of groups created - each element in the array is the current cohort
  // this allows us to add the correct number of group (rows) to the table
  for (let i = 0; i < groups.length; i++) {
    cohortArr.push(currentCohort);
  }

  const deleteGroups = `DELETE FROM coding_groups WHERE cohort_name = '${currentCohort}'`;
  await pool.query(deleteGroups);

  const insertGroups = `INSERT INTO coding_groups (cohort_name) VALUES ('${cohortArr.join(
    "'), ('"
  )}') RETURNING *`;
  await pool.query(insertGroups);

  const fetchGroupIds = `SELECT group_id FROM coding_groups WHERE cohort_name = '${currentCohort}'`;
  await pool.query(fetchGroupIds).then((result) => {
    result.rows.forEach((el) => {
      groupIdArr.push(el["group_id"]);
    });
    console.log(groupIdArr);
    console.log(groups);
  });

  const insertStudents = `INSERT INTO assigned_student_groupings (student_id, group_id) VALUES ($1, $2) RETURNING *`;

  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      pool.query(insertStudents, [groups[i][j]["student_id"], groupIdArr[i]]);
    }
  }
  // .then((result) => res.send(result.rows))
  // .catch((err) => res.send(err));
});

// Route to fetch the groups from assigned_coding_groups
app.get("/api/assigned-student-groupings", (req, res) => {
  pool
    .query("SELECT * FROM assigned_student_groupings")
    .then((result) => res.send(result.rows))
    .catch((error) => res.send(error));
});

app.get("/api/get-group-ids", async (req, res) => {
  const { currentCohort } = req.body;
  const groupIdArr = [];
  const fetchGroupIds = `SELECT group_id FROM coding_groups WHERE cohort_name = '${currentCohort}'`;
  await pool
    .query(fetchGroupIds)
    .then((result) => {
      result.rows.forEach((el) => {
        groupIdArr.push(el["group_id"]);
      });
    })
    .then((result) => res.send(result.rows));
});

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
app.post("/api/create/user", (req, res) => {
  //Creates a random string with 25 different characters
  const random = strings.random(25);
  const user = req.body;
  //Creates an account specific json web token using username and a random string
  const accountToken = sign({ id: user.username }, random);
  //Creates a random string to be updated each time user signs in
  //First created token is a place holder
  const sessionToken = strings.random(30);
  //hashes the input password to be stored securely
  _hash(user.password, saltRounds, (err, hash) => {
    //The password is hashed now and can be stored with the hash parameter
    pool
      .query(
        "INSERT INTO users (username, password, token, session_token) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING RETURNING *",
        [user.username, hash, accountToken, sessionToken]
      )
      //Checks to see what was returned
      //If a account already exists it sends back result.rows with a length of zero
      //If account was created it sends back the account info
      .then((result) => {
        result.rows.length === 0
          ? res.status(409).send([{ result: "false" }])
          : res.status(201).send([{ result: "true" }]);
      })
      .catch((error) => res.status(400).send(error));
  });
});

//Route handler for user login
app.post("/api/login", (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  pool
    .query("SELECT * FROM users WHERE username = $1", [user])
    //Checks to see if the username matches stored username
    .then((data) => {
      //If username doesn't match a stored username it sends back Incorrect Username
      if (data.rows.length === 0) {
        res.send([{ response: "Incorrect Username" }]);
      } else {
        //If username matches it does a bcrypt compare to check if the password is correct
        compare(password, data.rows[0].password, function (err, result) {
          //If passowrd is correct it sends the users information
          result == true
            ? res.send([
                {
                  username: data.rows[0].username,
                  cohort: data.rows[0].default_cohort,
                  userToken: data.rows[0].token,
                  sessionToken: data.rows[0].session_token,
                  asanaToken: data.rows[0].asana_access_token,
                },
              ])
            : res.send([{ response: "false" }]);
        });
      }
    });
});

//Route to verify the user logging in
app.post("/api/authent", (req, res) => {
  //Access the request body that is sent with the fetch
  const user = req.body.username;
  const userToken = req.body.userToken;
  const sessionToken = req.body.sessionToken;
  //Accesses the tokens from the user sent with username
  pool
    .query("SELECT token, session_token FROM users WHERE username = $1", [user])
    .then((result) => {
      //Compares the stored tokens with sent token and sends a response based on result
      userToken == result.rows[0].token && sessionToken == result.rows[0].session_token
        ? res.status(200).send([{ response: "true" }])
        : res.status(401).send([{ response: "false" }]);
    })
    .catch((error) => res.status(404).send(error));
});

//Route to update users session token on login
//Takes place after successful password authentication
app.patch("/api/token", (req, res) => {
  const user = req.body.username;
  //Creates a random string for the session token
  const sessionToken = strings.random(30);
  //Updates the current session token with the new one and returns new token
  pool
    .query("UPDATE users SET session_token = $1 WHERE username = $2 RETURNING session_token", [
      sessionToken,
      user,
    ])
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

// route for creating new cohort
app.post(`/api/create/cohort`, (req, res) => {
  // gets cohort object from body
  const newCohort = req.body.newCohort;
  // updates cohort table inside database
  pool
    .query(
      `INSERT INTO cohorts (cohort_name, begin_date, end_date, instructor) VALUES ($1, $2, $3, $4) RETURNING *`,
      [newCohort.name, newCohort.begin_date, newCohort.end_date, newCohort.instructor]
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

// route for getting all learn assessment names
app.get(`/api/learn/assessment-names`, (req, res) => {
  pool
    .query(` SELECT * FROM learn;`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

// route for getting all project names
app.get(`/api/projects/project-names`, (req, res) => {
  pool
    .query(` SELECT * FROM projects;`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

// route to post the learn grates for selected users
app.post(`/api/learn/grades-update`, (req, res) => {
  //gets information from the body
  console.log(req.body);
  let student_id = req.body.student_id;
  let assessment_id = req.body.assessment_id;
  let assessment_grade = req.body.assessment_grade;
  //updates the learn_grades table in the database
  pool
    .query(
      `INSERT INTO learn_grades (student_id, assessment_id, assessment_grade) VALUES ($1, $2, $3);`,
      [student_id, assessment_id, assessment_grade]
    )
    .then((result) => {
      console.log("Inside Asana **********************");
      //const client = Client.create().useAccessToken(process.env.asanaPrivateToken);
      //Create a sub task
      client.tasks
        .createSubtaskForTask(1204083444763917, { name: "React Assessment 250%", pretty: true })
        .then((result) => {
          console.log(result);
        });
    })
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

////////////////////////////////////////ROUTES FOR WEEKLY UPDATE MODAL////////////////////////////////////////

//Route that updates the student_teamwork_skills table with the tech scores for a group of students
app.post(`/api/weekly-update/tech-skills`, (req, res) => {
  const students = req.body.students;
  let record_date = new Date().toISOString();
  let values = [];
  students.forEach((student) => values.push([student.student_id, student.score, record_date]));
  pool
    .query(
      format("INSERT INTO student_tech_skills (student_id, score, record_date) VALUES %L", values),
      []
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

//Route updates the student_teamwork_skills table with the team scores for a group of students
app.post(`/api/weekly-update/teamwork-skills`, (req, res) => {
  const students = req.body.students;
  let record_date = new Date().toISOString();
  let values = [];
  students.forEach((student) => values.push([student.student_id, student.score, record_date]));
  pool
    .query(
      format(
        "INSERT INTO student_teamwork_skills (student_id, score, record_date) VALUES %L",
        values
      ),
      []
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

////////////////////////////////////////ROUTES FOR ASSESSMENT MODAL////////////////////////////////////////
//Route posts the learn_grades table with the assessment grades for a group of students
//insert students grade in the database
//do a select query to get taskId and assessment name
//use the above to create a sub task in asana
app.post(`/api/application-update/learn-grades-post`, (req, res) => {
  const students = req.body.students; //[ { student_id: '1', assessment_id: 2, assessment_grade: 20 } ]
  console.log("students body ", students); //[ { student_id: '1', assessment_id: 3, assessment_grade: 30 } ]
  let values = [];
  let i = 0;
  students.forEach((student) => {
    values.push([student.student_id, student.assessment_id, student.assessment_grade]);
  });
  console.log("values: ", values); // [ [ '1', 8, 80 ], [ '2', 2, 30 ] ]

  Promise.all(
    students.map((student) => {
      //.catch(error => res.status(404).send(error))
      console.log("values inside promise ", values);
      pool
        .query(
          format(
            "INSERT INTO learn_grades (student_id, assessment_id, assessment_grade) VALUES %L",
            values
          ),
          []
        )
        .then((result) => {
          res.status(200).send(result.rows);
          // console.log("result.rows after insert into query ",result)
          // console.log("values after the insert query ", values);
        })
        .then(() => {
          return pool.query(`select students.asana_task_id as asana_task_id, learn_grades.student_id as student_id, learn_grades.assessment_id as assessment_id, learn.assessment_name as assessment_name, learn_grades.assessment_grade as assessment_grade
            from learn_grades
                join students on learn_grades.student_id = students.student_id
                join learn on learn_grades.assessment_id = learn.assessment_id
            where learn_grades.student_id = ${students[0].student_id}`);
        })
        .then((result) => {
          let lastElement = result.rows.length - 1;
          console.log("value of result is: ", result.rows);
          // console.log("result.rows[0].asana_task_id is: ", result.rows[0].asana_task_id)
          console.log("after select query: ", {
            ...student,
            taskId: result.rows[lastElement].asana_task_id,
            assessment_name: result.rows[lastElement].assessment_name,
          });
          //return {...result.rows, taskId: result.rows[0].asana_task_id, assessment_name: result.rows[0].assessment_name}
          //Create a sub task
          client.tasks
            .createSubtaskForTask(result.rows[lastElement].asana_task_id, {
              name: `${result.rows[lastElement].assessment_name}: ${student.assessment_grade}`,
              pretty: true,
            })
            .then((result) => {
              //console.log("Subtask Created: ",result);
            });
          return {
            ...student,
            taskId: result.rows[0].asana_task_id,
            assessment_name: result.rows[0].assessment_name,
          };
        });
    })
  );
});

//Route updates the learn_grades table with the assessment grades for a group of students
app.post(`/api/application-update/learn-grades-update`, (req, res) => {
  const students = req.body.students;
  const promises = students.map((student) => {
    const studentId = student.student_id;
    const assessmentId = student.assessment_id;
    const assessmentGrade = student.assessment_grade;
    return pool.query(
      format(
        `UPDATE learn_grades SET assessment_grade = %s WHERE student_id = %s AND assessment_id = %s;`,
        assessmentGrade,
        studentId,
        assessmentId
      )
    );
  });
  Promise.all(promises)
    .then((result) => res.status(200).send(result))
    .catch((error) => res.status(404).send(error));
});

//Route selects all from learn_grades table
app.get(`/api/learn-grades`, (req, res) => {
  pool
    .query(`SELECT * FROM learn_grades;`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

////////////////////////////////////////ROUTES FOR PROJECT MODAL////////////////////////////////////////

//Route posts the project_grades table with the project grades for a group of students
app.post(`/api/application-update/project-grades-post`, (req, res) => {
  const students = req.body.students;
  let values = [];
  students.forEach((student) =>
    values.push([student.student_id, student.project_id, student.project_passed])
  );
  pool
    .query(
      format(
        "INSERT INTO project_grades (student_id, project_id, project_passed) VALUES %L",
        values
      ),
      []
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

//Route updates the project_grades table with the project grades for a group of students
app.post(`/api/application-update/project-grades-update`, (req, res) => {
  const students = req.body.students;
  const promises = students.map((student) => {
    const studentId = student.student_id;
    const projectId = student.project_id;
    const projectPassed = student.project_passed;
    return pool.query(
      format(
        `UPDATE project_grades SET project_passed = %L WHERE student_id = %s AND project_id = %s;`,
        projectPassed,
        studentId,
        projectId
      )
    );
  });
  Promise.all(promises)
    .then((result) => res.status(200).send(result))
    .catch((error) => {
      res.status(404).send(error);
      console.log(error);
    });
});

//Route selects all from the project)grades table
app.get(`/api/project-grades`, (req, res) => {
  pool
    .query(`SELECT * FROM project_grades;`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

//Creates a route to insert multiple students into a cohort
//This also creates a task for those students in Asana board
app.post("/api/create/students", (req, res) => {
  const students = req.body.students;
  Promise.all(
    students.map((student) => {
      return client.tasks
        .createTask({ projects: [asanaProjectId], name: `${student.name}`, pretty: true }) //creates Task in Asana Project, asanaProjectId is a variable that stores project GID from Asana
        .then((result) => {
          return { ...student, taskId: result.gid }; //returns each student object from body, and adds taskId to that student object
        })
        .catch((err) => console.error(err));
    })
  ).then((students) => {
    const values = students.map((student) => {
      return [student.name, student.cohort_name, student.github, student.taskId];
    });
    pool
      .query(
        format(
          "INSERT INTO students (name, cohort_name, github, asana_task_id) VALUES %L RETURNING *",
          values
        ),
        []
      )
      .then((result) => res.send(result.rows))
      .catch((error) => res.send(error));
  });
});

app.get("/api/student/scores/:id", (req, res) => {
  let studentId = req.params.id;
  pool
    .query(
      `SELECT *
                FROM students
                RIGHT JOIN project_grades
                ON students.student_id = project_grades.student_id 
                AND students.student_id=$1
                JOIN projects
                ON project_grades.project_id = projects.project_id`,
      [studentId]
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

app.get("/api/student/learn/scores/:id", (req, res) => {
  let studentId = req.params.id;
  pool
    .query(
      `SELECT *
                FROM learn_grades
                RIGHT JOIN learn
                ON learn_grades.assessment_id=learn.assessment_id
                WHERE learn_grades.student_id=$1`,
      [studentId]
    )
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
