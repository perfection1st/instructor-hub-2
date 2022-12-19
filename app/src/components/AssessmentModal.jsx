import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsBarChartLineFill } from "react-icons/bs";
import { StudentsList } from "../frontEndFunctions";

export const AssessmentModal = () => {

  // state for assessment modal displaying/not displaying
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  // close assessment modal function
  const handleCloseAssessmentModal = () => setShowAssessmentModal(false);
  // open assessment modal function
  const handleShowAssessmentModal = () => setShowAssessmentModal(true);

  // state for assessment grading modal displaying/not displaying
  const [showAssessmentGradingModal, setShowAssessmentGradingModal] = useState(false);
  // close assessment grading modal function
  const handleCloseAssessmentGradingModal = () => setShowAssessmentGradingModal(false);
  // open assessment grading modal function
  const handleShowAssessmentGradingModal = () => setShowAssessmentGradingModal(true);

  return (
    <>
      <button id="btn-assessment-update" onClick={handleShowAssessmentModal}><BsBarChartLineFill /> Assessments</button>

      {/* Assessment modal */}
      <Modal id="assessment-update-modal" size="md" centered show={showAssessmentModal} onHide={handleCloseAssessmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select id="assessment-selector" name="assessments">
            <option value="placeholder">-- Select Assessment --</option>
            <option value="data">Data Types/Variables</option>
            <option value="loops">Loops</option>
            <option value="functions">Functions</option>
            <option value="arrays">Arrays</option>
            <option value="objects">Objects</option>
            <option value="dom">DOM API</option>
            <option value="server">Server Side</option>
            <option value="db">Server and DB</option>
            <option value="react">React</option>
          </select>
          <ul id='assessment-student-list'>
            <StudentsList />
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleCloseAssessmentModal(); handleShowAssessmentGradingModal() }}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assessment Grading modal */}
      <Modal id="assessment-grading-modal" size="md" centered show={showAssessmentGradingModal} onHide={handleCloseAssessmentGradingModal}>
        <Modal.Header closeButton>
          {/* assessment name displayed based of selection on previous modal */}
          <Modal.Title>Selected Assessment Grades</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id='assessment-grade-input'>
            <ul id='assessment-selected-students'>
              {/* student names displayed based off students selected from previous modal */}
              <li>Selected student 1<input type="number" max="100" min="0" /></li>
              <li>Selected student 2<input type="number" max="100" min="0" /></li>
              <li>Selected student 3<input type="number" max="100" min="0" /></li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleCloseAssessmentGradingModal(); handleShowAssessmentModal() }}>Back</Button>
          <Button variant="primary" onClick={handleCloseAssessmentGradingModal}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}