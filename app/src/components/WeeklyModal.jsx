import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsCalendarPlusFill } from "react-icons/bs";
import { ModalList } from './ModalList';
import swal from 'sweetalert';

export const WeeklyModal = (props) => {
  //State of all users courses
  const { courses, setCourses, selectedStudents, setSelectedStudents } = props

  // state for weekly modal displaying/not displaying
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  // state for Weekly grading modal displaying/not displaying
  const [showWeeklyGradingModal, setShowWeeklyGradingModal] = useState(false);

  const handleDropdownChange = (student_id, type, value) => {
    setSelectedStudents(prevStudents => prevStudents.map(student => {
      if (student.student_id === student_id) {
        return {
          ...student,
          [type]: parseInt(value),
        };
      }
      return student;
    }));
  };


  /////////////////// WEEKLY MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close weekly modal function
  const handleCloseWeeklyModal = () => {
    setSelectedStudents([])
    setShowWeeklyModal(false)
  };

  // open weekly modal function
  const handleShowWeeklyModal = (e) => {
    setShowWeeklyModal(true)
  };

  /////////////////// WEEKLY GRADING MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close Weekly grading modal function
  const handleCloseWeeklyGradingModal = () => {
    setSelectedStudents([]);
    setShowWeeklyGradingModal(false)
  }

  // open Weekly grading modal function
  const handleShowWeeklyGradingModal = () => {
    setShowWeeklyGradingModal(true);
  }

  /////////////////// NEXT, BACK, and SUBMIT BUTTON FUNCTIONS ///////////////////
  // switch between weekly modal and the weekly grading modal
  const handleNextModal = () => {
    setShowWeeklyModal(false);
    handleShowWeeklyGradingModal()
  }

  // go back from the assessment grading modal to the assessment modal
  const handleBackButton = () => {
    setSelectedStudents([]);
    setShowWeeklyGradingModal(false);
    setShowWeeklyModal(true)
  }

  // submit the data to the database
  const handleSubmitButton = () => {

    //sends a fetch call to update tech skills for all selected students
    fetch(`http://localhost:8000/api/weekly-update/tech-skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: selectedStudents.map(student => ({
          student_id: student.student_id,
          score: student.techAptitude * 25
        }))
      })
    })
      .then(result => result.json())
      .then(data => {
        swal("team / tech scores posted successfully")
      })
      .catch(error => {
        console.log(error)
      })

    //sends a fetch call to update tech skills for all selected students
    fetch(`http://localhost:8000/api/weekly-update/teamwork-skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: selectedStudents.map(student => ({
          student_id: student.student_id,
          score: student.teamAptitude * 25
        }))
      })
    })
      .then(result => result.json())
      .then(data => {
        swal("team / tech scores posted successfully")
      })
      .catch(error => {
        console.log(error)
      })

    handleCloseWeeklyGradingModal()
  }

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
            <ModalList courses={courses} setShowWeeklyModal={setShowWeeklyModal} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents} />
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNextModal}>
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
              {selectedStudents.map(student => <li key={student.student_id} value={student.student_id}>
                {student.name}
                {/* adds a space between the name and dropdown */}
                <>  </>
                <select
                  className='tech-aptitude'
                  value={student.techAptitude}
                  onChange={e => handleDropdownChange(student.student_id, 'techAptitude', e.target.value)}
                >
                  <option value="1">Tech 1</option>
                  <option value="2">Tech 2</option>
                  <option value="3">Tech 3</option>
                  <option value="4">Tech 4</option>
                </select>
                <select
                  className='team-aptitude'
                  value={student.teamAptitude}
                  onChange={e => handleDropdownChange(student.student_id, 'teamAptitude', e.target.value)}
                >
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
          <Button variant="secondary" onClick={handleBackButton}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmitButton}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

