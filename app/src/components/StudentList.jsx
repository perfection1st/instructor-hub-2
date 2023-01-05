import { LoadingDropdown } from './Loading';
import { StudentStats } from './StudentStats';
import { StudentAverages } from './StudentAverages';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { useState, useEffect, Suspense } from 'react';
import Form from 'react-bootstrap/Form';
import { GenerateGroupsModal } from './GenerateGroupsModal' 


export const StudentList = (props) => {

  const URL = 'http://localhost:8000/api'


  //State courses is set in home
  const { courses, setCourses, isLoadingCourses, setIsLoadingCourses } = props

  const [selectedClass, setSelectedClass] = useState('Cohorts')
  const [students, setStudents] = useState([])

  // useEffect(() => {
  //   fetch(`${URL}/students/${sessionStorage.getItem('defaultCohort')}`)
  //   .then(result => result.json())
  //   .then(data => setStudents(data))
  // }, [])

  function loadStudents(evt) {
    console.log(evt)
    fetch(`${URL}/students/${evt}`)
      .then(result => result.json())
      .then(data => setStudents(data))
    console.log(students)
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

        </DropdownButton><GenerateGroupsModal students={students} />
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
                <tr key={student.student_id}>
                  <td >{student.name}</td>
                  <td>{student.github}</td>
                  <td className="student-average" width={'15%'}>
                    <ButtonGroup aria-label="Basic example">
                      <Button variant="secondary" size="sm">
                        <Badge bg="danger">30%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Badge bg="warning">70%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Badge bg="success">100%</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>)}
            </tbody>
          </Table>
        </div>
        <StudentAverages />
      </div>
    </>
  );
}
