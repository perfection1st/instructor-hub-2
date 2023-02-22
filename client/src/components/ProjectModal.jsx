import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ModalList } from './ModalList';
import swal from 'sweetalert';

export const ProjectModal = (props) => {

  const { courses, setCourses, checked, setChecked, selectedStudents, setSelectedStudents } = props
  const URL = 'http://localhost:8000'

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
    setShowProjectModal(true);
  }

  /////////////////// PROJECT GRADING MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close Project grading modal function
  const handleCloseProjectGradingModal = () => {
    setCurrentSelectedProjectName("")
    setCurrentSelectedProjectID(0)
    setSelectedStudents([]);
    setShowProjectGradingModal(false);
  }

  // open Project grading modal function
  const handleShowProjectGradingModal = () => {
    fetch(`${URL}/api/project-grades`)
      .then(res => res.json())
      .then(data => {
        setCurrentProjectGrades(data)
      });
    setShowProjectGradingModal(true);
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
      fetch(`${URL}/api/application-update/project-grades-post`, {
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
      fetch(`${URL}/api/application-update/project-grades-update`, {
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

  return (
    <>
      <button id="btn-project-update" onClick={() => {
        let currentClass = sessionStorage.getItem('currentClass')
        if (!currentClass) {
          setShowProjectModal(false)
          swal('No cohort selected')
        } else {
          handleShowProjectModal()
        }
      }}><BsFileEarmarkCodeFill /> Project Update </button>

      {/* Project modal */}
      <Modal id="project-update-modal" size="md" centered show={showProjectModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select id="project-selector" name="projects" onChange={(e) => handleSelectProject(e)}>
            <option value="placeholder">{currentSelectedProjectName === "" ? "-- Select Project --" : currentSelectedProjectName}</option>
            {allProjectNames.map(names => {
              if (currentSelectedProjectName === names.project_name) {
                return
              }
              return <option key={names.project_id} value={names.project_name}>{names.project_name}</option>
            })}
          </select>
          <ModalList courses={courses} setShowProjectModal={setShowProjectModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNextModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Project grading modal */}
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
    </>
  )
}