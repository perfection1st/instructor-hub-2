import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ModalList } from './ModalList';

export const ProjectModal = (props) => {

  const { courses, setCourses, checked, setChecked, selectedStudents, setSelectedStudents } = props
  const URL = 'http://localhost:8000'

  // state for storing the current project that is selected
  const [currentSelectedProject, setCurrentSelectedProject] = useState("")

  // state for storing all of the project names that are fetched from the database
  const [allProjectNames, setAllProjectNames] = useState([]);

  // state for project modal displaying/not displaying
  const [showProjectModal, setShowProjectModal] = useState(false);
  // close project modal function
  const handleCloseProjectModal = () => {
    setCurrentSelectedProject("")
    // setSelectedStudents([]);
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
          <select id="project-selector" name="projects" onChange={(e) => setCurrentSelectedProject(e.target.value)}>
            <option value="placeholder">{currentSelectedProject === "" ? "-- Select Project --" : currentSelectedProject}</option>
            {allProjectNames.map(names => {
              if (currentSelectedProject === names.project_name) {
                return
              }
              return <option key={names.project_id} value={names.project_name}>{names.project_name}</option>
            })}
          </select>
          <ModalList courses={courses} setShowProjectModal={setShowProjectModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
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