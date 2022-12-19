import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";

export const ProjectModal = () => {

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

  return (
    <>
      <button id="btn-project-update" onClick={handleShowProjectModal}><BsFileEarmarkCodeFill /> Project Update </button>

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
    </>
  )
}