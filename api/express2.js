//Route selects all from students table
app.get(`/api/students`, (req, res) => {
  pool
    .query(`SELECT * FROM students;`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});

//Route to get data by student id
app.get(`/api/students/:id`, (req, res) => {
  pool
    .query(`SELECT * FROM students WHERE id = ${req.params.id}`)
    .then((result) => res.status(200).send(result.rows))
    .catch((error) => res.status(404).send(error));
});
