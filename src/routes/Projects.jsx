import React, {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import  Modal  from 'react-bootstrap/Modal';
import { ModalList } from '/components/ModalList';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LoadingDropdown } from '../components/Loading';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';





const Projects = (props) => {
    const URL = 'http://localhost:8000/api'
    const { checked, setChecked } = props
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
   // state for project modal displaying/not displaying
  const [showProjectModal, setShowProjectModal] = useState(false);
  // state for Project grading modal displaying/not displaying
  const [showProjectGradingModal, setShowProjectGradingModal] = useState(false);
  // state for storing all of the project names that are fetched from the database
  const [allProjectNames, setAllProjectNames] = useState([]);
  // state for storing the current assessment name that is selected
  const [currentSelectedProjectName, setCurrentSelectedProjectName] = useState("")
  // state for storing the current assessment ID that is selected
  const [currentSelectedProjectID, setCurrentSelectedProjectID] = useState(0)
  // state for storing the current grades from the learn grades table
  const [currentProjectGrades, setCurrentProjectGrades] = useState([])
  // state for storing current course
  const [ courses, setCourses ] = useState([]);
  //state for storing students
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [gradePro, setGradePro] = useState([])




  const [selectedClass, setSelectedClass] = useState('Cohorts')
  // const { projectCourses, projectSetCourses, isLoadingCourses, setIsLoadingCourses } = props

  const selectedProject = currentProjectGrades.find((project) => {
    return project.project_id === currentSelectedProjectID
    
  })

    // this function sets the currentSelectedAssessmentName and currentSelectedAssessmentID states for the selected assessment
  const handleSelectProject = (e) => {
    setCurrentSelectedProjectName(e.target.value);
    const selectedProject = allProjectNames.find(project => project.project_name === e.target.value);
    setCurrentSelectedProjectID(selectedProject.project_id);
  }

  //this function sets the selected grade for the respective student and assigns it to the selected students state
  const handleSelectProjectGrade = (e, student_id) => {
    setSelectedStudents(
      prevStudents => prevStudents.map(student => {
        if (student.student_id === student_id) {
          return {
            ...student,
            projectGrade: e.target.value,
          };
        }
        return student;
      }));
  }


 /////////////////// PROJECT MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close project modal function
  const handleCloseProjectModal = () => {
    setCurrentSelectedProjectName("")
    setCurrentSelectedProjectID(0)
    setSelectedStudents([]);
    setShowProjectModal(false);
  }

  // open project modal function
  const handleShowProjectModal = () => {
    fetch(`${URL}/api/projects/project-names`)
      .then(res => res.json())
      .then(data => {
        setAllProjectNames(data)
      });
    // setShowProjectModal(true);
  }

    // close Project grading modal function
    const handleCloseProjectGradingModal = () => {
      setCurrentSelectedProjectName("")
      setCurrentSelectedProjectID(0)
      setSelectedStudents([]);
      setShowProjectGradingModal(false);
    }



  /////////////////// NEXT, BACK, and SUBMIT BUTTON FUNCTIONS ///////////////////
  // switch between project modal and the project grading modal
  const handleNextModal = () => {
    setShowProjectModal(false)
    handleShowProjectGradingModal()
  }

  // go back from the project grading modal to the project modal
  const handleBackButton = () => {
    setSelectedStudents([]);
    setShowProjectGradingModal(false)
    setShowProjectModal(true)
  }

  // submit the data to the database
  const handleSubmitButton = () => {

    //filters all of the values that are already in the database
    let filteredStudentsWhoAlreadyHaveGrades = selectedStudents.filter(student => {
      for(let i = 0; i < currentProjectGrades.length; i++){
        if(currentProjectGrades[i].student_id == student.student_id && currentProjectGrades[i].project_id == currentSelectedProjectID){
          return true;
        }
      }
      return false;
    })

    //filters all of the values that are not already in the database
    let filteredStudentsWhoDoNotAlreadyHaveGrades = selectedStudents.filter(student => {
      for(let i = 0; i < currentProjectGrades.length; i++){
        if(currentProjectGrades[i].student_id == student.student_id && currentProjectGrades[i].project_id == currentSelectedProjectID){
          return false;
        }
      }
      return true;
    })

// sends a fetch call to post learn grades for all selected students who do not already have grades in the database
    // this will only fire the fetch call if the filteredStudentsWhoDoNotAlreadyHaveGrades variable has a value in it
    if(filteredStudentsWhoDoNotAlreadyHaveGrades.length > 0){
      fetch(`${URL}/application-update/project-grades-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: filteredStudentsWhoDoNotAlreadyHaveGrades.map(student => ({
            student_id: student.student_id,
            project_id: currentSelectedProjectID,
            project_passed: student.projectGrade === "Pass" ? true : false
          }))
        })
      })
      .then(result => result.json())
      .then(data => {
        swal("project grades posted successfully")        
      })
      .catch(error => {
        console.log(error)
      })
    }

    // sends a fetch call to update learn grades for all selected students who already have grades in the database
    // this will only fire the fetch call if the filteredStudentsWhoAlreadyHaveGrades variable has a value in it
    if(filteredStudentsWhoAlreadyHaveGrades.length > 0){
      fetch(`${URL}/application-update/project-grades-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: filteredStudentsWhoAlreadyHaveGrades.map(student => ({
            student_id: student.student_id,
            project_id: currentSelectedProjectID,
            project_passed: student.projectGrade === "Pass" ? true : false
          }))
        }),
      })
      .then(result => result.json())
      .then(data => {
        swal("project grades posted successfully")        
      })
      .catch(error => {
        console.log(error)
      })
    }
    
    handleCloseProjectGradingModal()
  }



    // open Project grading modal function
    const handleShowProjectGradingModal = () => {
        fetch(`${URL}/project-grades`)
          .then(res => res.json())
          .then(data => {
            setCurrentProjectGrades(data)
          });
        setShowProjectGradingModal(true);

      }


// function to get all project names
const getProjects = () => {
 fetch(`${URL}/projects/project-names`)
 .then(res => res.json())
  .then(data => {
    setAllProjectNames(data)
  })
}

// function to get current project grade
const proGrade = () => {
  for (const project of currentProjectGrades) {
    if (project.project_id === currentSelectedProjectID) {
      if (project.project_passed === true) {
        return 'Pass';

      } else {
        (project.project_passed === false)
        return "Fail";
      }
    }
  } 
  fetch(`${URL}/project-grades`)
  .then(res => res.json())
  .then(data => {
    setCurrentProjectGrades(data)
    // console.log(data)
    // console.log(currentSelectedProjectID)
  });
}

 //Does a fetch to get the students
 function loadStudents(evt) {

  fetch(`${URL}/students/${evt}`)
    .then(result => result.json())
    .then(data => setStudents(data))

}


// function for clicking checkbox on students
function clickStudent(e) {
  //Checks to see if box was unclicked
  //Removes student from state used to add changes if so
  if (!e.target.checked) {
      let findKey = e.target.id
      //Filters the selected students to remove the unchecked student
      let deleteObj = selectedStudents.filter(obj => {
          return obj.student_id !== findKey
      })
      setSelectedStudents(deleteObj)
  } else {
      //Checks to see if there is already anything in the state
      //If not it only puts the obj in without spread operator
      if (selectedStudents == []) {
          let obj = {
              student_id: e.target.id,
              name: e.target.value,
              techAptitude: 4,
              teamAptitude: 4,
              learnGrade: 100,
              projectGrade: "Pass"
          }
          setSelectedStudents(obj)
      } else {
          let obj = {
              student_id: e.target.id,
              name: e.target.value,
              techAptitude: 4,
              teamAptitude: 4,
              learnGrade: 100,
              projectGrade: "Pass"
          }
          setSelectedStudents([...selectedStudents, obj])
      }
  }
}

// function to get individual student grade
const studentProjectGrade = (studentID, selectedProj) => {
  if (selectedProj) {
      for(let grade of currentProjectGrades) {
        if (grade.student_id === studentID && selectedProj.project_id === grade.project_id) {    
       return grade.project_passed ? "Pass" : "Fail"
      }
    }
  }
}

useEffect(() => {
  dbCohorts()
  getProjects()
  loadStudents()
  proGrade()
  },[])

  function dbCohorts() {
    fetch(`${URL}/cohorts`)
        .then(result => result.json())
        .then(data => {
          setCourses(data)
        })
        .then(setIsLoadingCourses(false))
  }



  return (
    <div>
        <div>
            <h1>Projects</h1>
            <div id="select-cohort">
        <h2>Select a Cohort</h2>
        <DropdownButton
          align="end"
          title={selectedClass}
          menuVariant="dark"
          id="dropdown-menu-align-end"
          size="md"
          onSelect={function (evt) {
            <ModalList courses={courses} setShowProjectModal={setShowProjectModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
            setSelectedClass(evt)
            sessionStorage.setItem('currentClass', evt)
            loadStudents(evt)
            console.log(currentProjectGrades)
          }}
        >
          {isLoadingCourses ? <LoadingDropdown /> : courses.map(course => <Dropdown.Item key={course.cohort_id} eventKey={course.cohort_name}>{course.cohort_name}</Dropdown.Item>)}

        </DropdownButton>
        <div>
          <h1>Select a Project</h1>
            <select id="project-selector" name="projects" onChange={(e) => 
              {
                handleSelectProject(e)
               setGradePro(proGrade())
              }
              
              }>
                <option value="placeholder">{currentSelectedProjectName === "" ? "-- Select Project --" : "Choose a project"}</option>
                {allProjectNames.map(names => {                
                if (currentSelectedProjectName === !names.project_name) {
                    return names.project_name
                }
                return <option key={names.project_id} value={names.project_name}>{names.project_name}</option>
                })}
            </select>
        </div>
      </div>
        </div>
        <div>
        <Table id="student-list" striped>
            <thead>
              <tr>

                <th>Name</th>
                <th>Project</th>
                <th>Pass/Fail</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student =>
                <tr key={student.student_id} >
                  <td id="student-name" value={students.student_id} onClick={(e) => {
                  }}>
                  <li key={student.student_id}>
                                <input
                                    type="checkbox"
                                    value={student.name}
                                    onChange={(e) => clickStudent(e)}
                                    id={student.student_id}
                                />
                                {student.name}
                            </li>
                   </td>
                  <td>{currentSelectedProjectName}</td>
                  <td className="student-average" width={'15%'}>
                    {/* {selectedProject && currentProjectGrades.project_passed ? "Pass" : "Fail"} */}
                    {studentProjectGrade(student.student_id, selectedProject)}
                  </td>
                  </tr>)}
            </tbody>
          </Table>
          <div>
          <div id='project-grade-input'>
            <ul id='assessment-selected-students'>
              {/* student names displayed based off students selected from previous modal */}
              {selectedStudents.map(student => <li key={student.student_id} value={student.student_id}>
                {student.name}
              </li>)}
            </ul>
          </div>
        </div>
          <Modal.Footer>
          {/* <ModalList courses={courses} setShowProjectModal={setShowProjectModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} /> */}

            <Button variant="primary" onClick={handleShowProjectGradingModal}>
                Next
            </Button>
            </Modal.Footer>
      <Modal id="project-grading-modal" size="md" centered show={showProjectGradingModal} onHide={handleCloseProjectGradingModal}>
        <Modal.Header closeButton>
          {/* project name displayed based of selection on previous modal */}
          <Modal.Title>
            Selected Project Grading:
            <br />
            {currentSelectedProjectName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id='project-grade-input'>
            <ul id='assessment-selected-students'>
              {/* student names displayed based off students selected from previous modal */}
              {selectedStudents.map(student => <li key={student.student_id} value={student.student_id}>
                {student.name}
                {/* adds a space between the name and dropdown */}
                <> </>
                <select
                  className='team-aptitude'
                  value={student.projectGrade}
                  onChange={e => handleSelectProjectGrade(e, student.student_id)}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
                {/* <input type="number" max="100" min="0" defaultValue={student.learnGrade} onChange={(e) => handleSelectProjectGrade(e, student.student_id)} /> */}
              </li>)}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBackButton}>Back</Button>
          <Button variant="primary" onClick={handleSubmitButton}>Submit ✓</Button>
        </Modal.Footer>
      </Modal>
      
        </div>
        
    </div>
  )
}

export default Projects