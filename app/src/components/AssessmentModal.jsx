import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsBarChartLineFill } from "react-icons/bs";
import { ModalList } from './ModalList';

export const AssessmentModal = (props) => {

  const { courses, setCourses, checked, setChecked, selectedStudents, setSelectedStudents } = props
  const URL = 'http://localhost:8000'

  // state for storing the current assessment that is selected
  const [ currentSelectedAssessment, setCurrentSelectedAssessment ] = useState("")
  // state for storing all of the assessment names that are fetched from the database
  const [ allAssessmentNames, setAllAssessmentNames ] = useState([]);
  // state for assessment modal displaying/not displaying
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  // state for assessment grading modal displaying/not displaying
  const [showAssessmentGradingModal, setShowAssessmentGradingModal] = useState(false);

  /////////////////// ASSESSMENT MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close assessment modal function
  const handleCloseAssessmentModal = () => {
    setCurrentSelectedAssessment("")
    setSelectedStudents([]);
    setShowAssessmentModal(false);
  }

  // open assessment modal function
  const handleShowAssessmentModal = () => {
    fetch(`${URL}/api/learn/assessment-names`)
    .then(res => res.json())
    .then(data => {
      setAllAssessmentNames(data)
    });
    setShowAssessmentModal(true);
  }
  
  /////////////////// ASSESSMENT GRADING MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close assessment grading modal function
  const handleCloseAssessmentGradingModal = () => {
    setCurrentSelectedAssessment("")
    setSelectedStudents([]);
    setShowAssessmentGradingModal(false);
  }

  // open assessment grading modal function
  const handleShowAssessmentGradingModal = () => setShowAssessmentGradingModal(true);

  /////////////////// NEXT, BACK, and SUBMIT BUTTON FUNCTIONS ///////////////////
  // switch between assessment modal and the assessment grading modal
  const handleNextModal = () => {
    setShowAssessmentModal(false);
    handleShowAssessmentGradingModal()
  }
  
  // go back from the assessment grading modal to the assessment modal
  const handleBackButton = () => {
    setShowAssessmentGradingModal(false);
    setShowAssessmentModal(true)
  }

  // submit the data to the database
  const handleSubmitButton = () => {
    
  }

  return (
    <>
      <button id="btn-assessment-update" onClick={handleShowAssessmentModal}><BsBarChartLineFill /> Assessments</button>

      {/* Assessment modal */}
      <Modal id="assessment-update-modal" size="md" centered show={showAssessmentModal} onHide={handleCloseAssessmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select id="assessment-selector" name="assessments" onChange={(e) => setCurrentSelectedAssessment(e.target.value) }>
            <option value="placeholder">-- Select Assessment --</option>
            {allAssessmentNames.map(names => {
              return <option key={names.assessment_id} value={names.assessment_name}>{names.assessment_name}</option>
            })}
          </select>
          <ul id='assessment-student-list'>
            <ModalList courses={courses} setShowAssessmentModal={setShowAssessmentModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents}/>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNextModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assessment Grading modal */}
      <Modal id="assessment-grading-modal" size="md" centered show={showAssessmentGradingModal} onHide={handleCloseAssessmentGradingModal}>
        <Modal.Header closeButton>
          {/* assessment name displayed based of selection on previous modal */}
          <Modal.Title>
            Selected Assessment Grades For:
            <br />
            {currentSelectedAssessment}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id='assessment-grade-input'>
            <ul id='assessment-selected-students'>
              {/* student names displayed based off students selected from previous modal */}
              {selectedStudents.map(students => <li key={students.gid} value={students.gid}>
                {students.name}
                {/* adds a space between the name and dropdown */}
                <> </>
                <input type="number" max="100" min="0" defaultValue="100" />
              </li>)}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBackButton}>Back</Button>
          <Button variant="primary" onClick={handleSubmitButton}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}