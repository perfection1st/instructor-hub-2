import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GoPlus } from "react-icons/go";
import { StudentsList } from "../frontEndFunctions"

export const Nav = (props) => {
  const { courses, setCourses } = props

  // state for weekly modal displaying/not displaying
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  // close weekly modal function
  const handleCloseWeeklyModal = () => setShowWeeklyModal(false);
  // open weekly modal function
  const handleShowWeeklyModal = () => setShowWeeklyModal(true);

  // state for Weekly grading modal displaying/not displaying
  const [showWeeklyGradingModal, setShowWeeklyGradingModal] = useState(false);
  // close Weekly grading modal function
  const handleCloseWeeklyGradingModal = () => setShowWeeklyGradingModal(false);
  // open Weekly grading modal function
  const handleShowWeeklyGradingModal = () => setShowWeeklyGradingModal(true);

  // state for project modal displaying/not displaying
  const [showProjectModal, setShowProjectModal] = useState(false);
  // close project modal function
  const handleCloseProjectModal = () => setShowProjectModal(false);
  // open project modal function
  const handleShowProjectModal = () => setShowProjectModal(true);

  // state for Project grading modal displaying/not displaying
  const [showProjectGradingModal, setShowProjectGradingModal] = useState(false);
  // close Project grading modal function
  const handleCloseProjectGradingModal = () => setShowProjectGradingModal(false);
  // open Project grading modal function
  const handleShowProjectGradingModal = () => setShowProjectGradingModal(true);

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
      <nav>
        <button id="btn-weekly-update" onClick={handleShowWeeklyModal}>Weekly Update <GoPlus /></button>
        <button id="btn-project-update" onClick={handleShowProjectModal}>Project Update <GoPlus /></button>
        <button id="btn-assessment-update" onClick={handleShowAssessmentModal}>Assessments <GoPlus /></button>
      </nav>

      {/* Weekly modal */}
      <Modal id="weekly-update-modal" size="md" centered show={showWeeklyModal} onHide={handleCloseWeeklyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Weekly</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul id='weekly-student-list'>
            {/* student list conditionally rendered based off what cohort is selected on page */}
            <StudentsList courses={courses}/>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleCloseWeeklyModal(); handleShowWeeklyGradingModal() }}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Weekly Grading modal */}
      <Modal id="weekly-grading-modal" size="md" centered show={showWeeklyGradingModal} onHide={handleCloseWeeklyGradingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Weekly Grades</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id='weekly-grade-input'>
            <ul id='weekly-selected-students'>
              {/* students displayed will be conditional based off students selected from previous modal */}
              <li>
                Selected student 1
                <select className='tech-aptitude'>
                  <option value="1">Tech 1</option>
                  <option value="2">Tech 2</option>
                  <option value="3">Tech 3</option>
                  <option value="4">Tech 4</option>
                </select>
                <select className='team-aptitude'>
                  <option value="1">Team 1</option>
                  <option value="2">Team 2</option>
                  <option value="3">Team 3</option>
                  <option value="4">Team 4</option>
                </select>
              </li>
              <li>
                Selected student 2
                <select className='tech-aptitude'>
                  <option value="1">Tech 1</option>
                  <option value="2">Tech 2</option>
                  <option value="3">Tech 3</option>
                  <option value="4">Tech 4</option>
                </select>
                <select className='team-aptitude'>
                  <option value="1">Team 1</option>
                  <option value="2">Team 2</option>
                  <option value="3">Team 3</option>
                  <option value="4">Team 4</option>
                </select>
              </li>
              <li>
                Selected student 3
                <select className='tech-aptitude'>
                  <option value="1">Tech 1</option>
                  <option value="2">Tech 2</option>
                  <option value="3">Tech 3</option>
                  <option value="4">Tech 4</option>
                </select>
                <select className='team-aptitude'>
                  <option value="1">Team 1</option>
                  <option value="2">Team 2</option>
                  <option value="3">Team 3</option>
                  <option value="4">Team 4</option>
                </select>
              </li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleCloseWeeklyGradingModal(); handleShowWeeklyModal() }}>Back</Button>
          <Button variant="primary" onClick={handleCloseWeeklyGradingModal}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Project modal */}
      <Modal id="project-update-modal" size="md" centered show={showProjectModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select id="project-selector" name="projects">
            {/* selecting a project will send fetch call to get list of groups that worked on said project */}
            <option value="placeholder">-- Select Project --</option>
            <option value="FEC">FEC</option>
            <option value="SDC">SDC</option>
            <option value="BO">Blue Ocean</option>
            <option value="Twiddler">Twiddler</option>
            <option value="Stoplight">Stoplight</option>
            <option value="Checkerboard">Checkerboard</option>
            <option value="ReactMVP">React MVP</option>
          </select>
          <select id="group-selector" name="groups">
            {/* these will be conditonally rendered based on project selection */}
            <option value="placeholder">-- Select Group --</option>
            <option value="groupName1">DREAM TEAM + TIM</option>
            <option value="groupName2">OPTIMA</option>
            <option value="groupName3">WIZARDS OF THE CODE</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleCloseProjectModal(); handleShowProjectGradingModal() }}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Project grading modal */}
      <Modal id="project-grading-modal" size="md" centered show={showProjectGradingModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          {/* project name displayed based of selection on previous modal */}
          <Modal.Title>Selected Project Grading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* group name displayed based off group selected from previous modal */}
          <h2 id='project-selected-group'>Selected group name here</h2>
          <select id="grade-selector" name="grades">
            <option value="placeholder">-- Pass/Fail --</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleCloseProjectGradingModal(); handleShowProjectModal() }}>Back</Button>
          <Button variant="primary" onClick={handleCloseProjectGradingModal}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>


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
  );
}