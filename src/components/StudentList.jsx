import { LoadingDropdown } from "./Loading";
import { StudentAverages } from "./StudentAverages";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
import React, { useState, useEffect, Suspense } from "react";
import Form from "react-bootstrap/Form";
import { StudentInfoModal } from "./StudentInfoModal";
import { AddStudentModal } from "./AddStudentsModal";

export const StudentList = (props) => {
  const URL = "http://localhost:8000/api";

  //State courses is set in home
  const { courses, setCourses, isLoadingCourses, setIsLoadingCourses } = props;

  // const [selectedClass, setSelectedClass] = useState('Cohorts')
  const [students, setStudents] = useState([]);
  const [learnAvg, setLearnAvg] = useState(0);
  const [teamworkAvg, setTeamworkAvg] = useState(0);
  const [techAvg, setTechAvg] = useState(0);
  // state for Student Info Modal displaying/not displaying
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);

  // open Student Info Modal function
  const handleShowStudentInfoModal = (name) => {
    setClickedStudent(name);
    setShowStudentInfoModal(true);
  };
  // state for current student clicked
  const [clickedStudent, setClickedStudent] = useState();
  // useState for assessment grades and project grades
  const [grades, setGrades] = useState([]);
  // useState for learn grades
  const [learnGrades, setLearnGrades] = useState([]);

  const url = "http://localhost:8000";

  //Does a fetch to get the students
  function loadStudents(evt) {
    console.log(evt);
    fetch(`${URL}/students/${evt}`)
      .then((result) => result.json())
      .then((data) => setStudents(data));
    console.log(students);
  }

  //Does a fetch to get all of the students scores from the current class
  useEffect(() => {
    let currentClass = '';
    if (sessionStorage.getItem("currentClass")) {
      currentClass = sessionStorage.getItem("currentClass");
    } else {
      currentClass = sessionStorage.getItem("defaultCohort");
    }
    fetch(`http://localhost:8000/api/students/${currentClass}`)
      .then((result) => result.json())
      .then((data) => {
        setStudents(data);
      })
      .then(() => {
        setLearnAvg(
          students.map((student) => student.learn_avg).reduce((acc, score) => acc + score, 0)
        );
        setTeamworkAvg(
          students.map((student) => student.teamwork_avg).reduce((acc, score) => acc + score, 0)
        );
        setTechAvg(
          students.map((student) => student.tech_avg).reduce((acc, score) => acc + score, 0)
        );
      });
  }, [courses]);

  //Does a fetch when student is clicked to get their grades from projects
  function getGrades(id) {
    fetch(`${url}/api/student/scores/${id}`)
      .then((result) => result.json())
      .then((data) => setGrades(data));
  }
  //Does a fetch when student is clicked to get their grades from learn content
  function getLearnGrades(id) {
    fetch(`${url}/api/student/learn/scores/${id}`)
      .then((result) => result.json())
      .then((data) => setLearnGrades(data));
  }

  //"Courses"
  return (
    <div id="dashboard-main">
      <div id="student-list-header">
        <h2>{sessionStorage.currentClass} - Students</h2>
        <div id="student-list-buttons-container">
          <AddStudentModal />
        </div>
      </div>
      <div id="student-list-container">
        <div id="student-table-container">
          <Table id="student-table" striped bordered hover>
            <thead>
              <tr id="student-table-header">
                <th>Name</th>
                <th>Learn Average</th>
                <th>Technical Average</th>
                <th>Teamwork Average</th>
                <th>GitHub</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td
                    id="student-name"
                    value={student.student_id}
                    onClick={(e) => {
                      getLearnGrades(student.student_id);
                      getGrades(student.student_id);
                      handleShowStudentInfoModal(student.name);
                    }}
                  >
                    {student.name}
                  </td>
                  <td>{student.learn_avg}</td>
                  <td>{student.tech_avg}</td>
                  <td>{student.teamwork_avg}</td>
                  <td>{student.github}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <StudentInfoModal
          grades={grades}
          learnGrades={learnGrades}
          clickedStudent={clickedStudent}
          showStudentInfoModal={showStudentInfoModal}
          setShowStudentInfoModal={setShowStudentInfoModal}
        />
      </div>
    </div>
  );
};
