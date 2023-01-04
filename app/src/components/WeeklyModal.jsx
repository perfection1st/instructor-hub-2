import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsCalendarPlusFill } from "react-icons/bs";
import { ModalList } from './ModalList';
import swal from 'sweetalert';

export const WeeklyModal = (props) => {
  //State of all users courses
  const { checked, setChecked, courses, setCourses, selectedStudents, setSelectedStudents } = props
  // state for weekly modal displaying/not displaying
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  // close weekly modal function
  const handleCloseWeeklyModal = () => {
    setSelectedStudents([])
    setShowWeeklyModal(false)
  };

  const handleNextModal = () => setShowWeeklyModal(false);

  // open weekly modal function
  const handleShowWeeklyModal = (e) => {
    setChecked(e.target.id)
    setShowWeeklyModal(true)
  };

  // state for Weekly grading modal displaying/not displaying
  const [showWeeklyGradingModal, setShowWeeklyGradingModal] = useState(false);
  // close Weekly grading modal function
  const handleCloseWeeklyGradingModal = () => setShowWeeklyGradingModal(false)
  // open Weekly grading modal function
  const handleShowWeeklyGradingModal = () => setShowWeeklyGradingModal(true);

  return (
    <>
      <button id="btn-weekly-update" onClick={(e) => {
        let currentClass = sessionStorage.getItem('currentClass')
        if (!currentClass) {
          setShowWeeklyModal(false)
          swal('No cohort selected')
        } else {
          handleShowWeeklyModal(e)
        }
      }}><BsCalendarPlusFill /> Add Weekly Update </button>

      {/* Weekly modal */}
      <Modal id="weekly-update-modal" size="md" centered show={showWeeklyModal} onHide={handleCloseWeeklyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Weekly</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul id='weekly-student-list'>
            {/* student list conditionally rendered based off what cohort is selected on page */}
            <ModalList courses={courses} setShowWeeklyModal={setShowWeeklyModal} checked={checked} setChecked={setChecked} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleNextModal(); handleShowWeeklyGradingModal() }}>
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
              {selectedStudents.map(students => <li key={students.student_id} value={students.student_id}>
                {students.name}
                {/* adds a space between the name and dropdown */}
                <>  </>
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
              </li>)}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => { handleCloseWeeklyGradingModal(); handleShowWeeklyModal(e) }}>Back</Button>
          <Button variant="primary" onClick={handleCloseWeeklyGradingModal}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

