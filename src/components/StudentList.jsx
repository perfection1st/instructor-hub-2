import { LoadingDropdown } from './Loading';
import { StudentAverages } from './StudentAverages';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import React, { useState, useEffect, Suspense } from 'react';
import Form from 'react-bootstrap/Form';
import { GenerateGroupsModal } from './GenerateGroupsModal' 
import { StudentInfoModal } from './StudentInfoModal'


export const StudentList = (props) => {

  const URL = 'http://localhost:8000/api'


  //State courses is set in home
  const { courses, setCourses, isLoadingCourses, setIsLoadingCourses } = props

  const [selectedClass, setSelectedClass] = useState('Cohorts')
  const [students, setStudents] = useState([])
  const [learnAvg, setLearnAvg] = useState(0)
  const [teamworkAvg, setTeamworkAvg] = useState(0)
  const [techAvg, setTechAvg] = useState(0)
  // state for Student Info Modal displaying/not displaying
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);

  // open Student Info Modal function
  const handleShowStudentInfoModal = (name) => {
    setClickedStudent(name)
    setShowStudentInfoModal(true)
    };
  // state for current student clicked
  const [clickedStudent, setClickedStudent] = useState();
  // useState for assessment grades and project grades
  const [grades, setGrades] = useState([])
  // useState for learn grades
  const [learnGrades, setLearnGrades] = useState([])

  const url = "http://localhost:8000"
  
  //Does a fetch to get the students
  function loadStudents(evt) {
    console.log(evt)
    fetch(`${URL}/students/${evt}`)
      .then(result => result.json())
      .then(data => setStudents(data))
    console.log(students)
    location.reload()
  }

  //Does a fetch to get all of the students scores from the current class
  useEffect(() => {
    let currentClass = sessionStorage.getItem('currentClass')
    fetch(`http://localhost:8000/api/students/${currentClass}`)
      .then(result => result.json())
      .then(data => {
        setStudents(data)
      })
      .then(() => {
        setLearnAvg(students.map(student => student.learn_avg).reduce((acc, score) => acc + score, 0))
        setTeamworkAvg(students.map(student => student.teamwork_avg).reduce((acc, score) => acc + score, 0))
        setTechAvg(students.map(student => student.tech_avg).reduce((acc, score) => acc + score, 0))
      })
  }, [courses])

  //Does a fetch when student is clicked to get their grades from projects
  function getGrades(id) {
        fetch(`${url}/api/student/scores/${id}`)
            .then(result => result.json())
            .then(data => setGrades(data))
          }
  //Does a fetch when student is clicked to get their grades from learn content
  function getLearnGrades(id){
        fetch(`${url}/api/student/learn/scores/${id}`)
            .then(result => result.json())
            .then(data => setLearnGrades(data))
    }

  //"Courses"
  return (
    <>
      <div id="select-cohort">
        <h2>Student List</h2>
        <DropdownButton
          align="end"
          title={selectedClass}
          menuVariant="dark"
          id="dropdown-menu-align-end"
          size="md"
          onSelect={function (evt) {
            setSelectedClass(evt)
            sessionStorage.setItem('currentClass', evt)
            loadStudents(evt)
          }}
        >
          {isLoadingCourses ? <LoadingDropdown /> : courses.map(course => <Dropdown.Item key={course.cohort_id} eventKey={course.cohort_name}>{course.cohort_name}</Dropdown.Item>)}

        </DropdownButton>
      </div>
      <div id="student-list-container">
        <div id="student-table-container">
          <Table id="student-list" striped>
            <thead>
              <tr>

                <th>Name</th>
                <th>GitHub</th>
                <th>Performance Averages (Learn/Team/Tech)</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student =>
                <tr key={student.student_id} >
                  <td id="student-name" value={student.student_id} onClick={(e) => {
                    getLearnGrades(student.student_id)
                    getGrades(student.student_id)
                    handleShowStudentInfoModal(student.name) 
                   }}>{student.name}</td>
                  <td>{student.github}</td>
                  <td className="student-average" width={'15%'}>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary" size="sm">
                        <Badge bg={student.learn_avg < 70 ? 'danger' : 'success'}>{student.learn_avg || '--'}%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Badge bg={student.tech_avg < 70 ? 'danger' : 'success'}>{student.tech_avg || '--'}%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Badge bg={student.teamwork_avg < 70 ? 'danger' : 'success'}>{student.teamwork_avg || '--'}%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>)}
            </tbody>
          </Table>
        </div>
        <StudentAverages students={students} learnAvg={learnAvg} teamworkAvg={teamworkAvg} techAvg={techAvg} />
        <GenerateGroupsModal students={students} />
        <StudentInfoModal grades={grades} learnGrades={learnGrades} clickedStudent={clickedStudent} showStudentInfoModal={showStudentInfoModal} setShowStudentInfoModal={setShowStudentInfoModal}/>
      </div>
    </>
  );
}
