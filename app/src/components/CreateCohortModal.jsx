import React, { useState } from 'react';
import { useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import swal from 'sweetalert';

export const CreateCohortModal = () => {
  // backend url 
  const url = "http://localhost:8000"

  // state for CreateCohort Modal displaying/not displaying
  const [showCreateCohortModal, setShowCreateCohortModal] = useState(false);
  // state for cohort begin date
  const [beginDate, setBeginDate] = useState(null);
  // state for cohort end date
  const [endDate, setEndDate] = useState(null);
  // close CreateCohort Modal function
  const handleCloseCreateCohortModal = () => setShowCreateCohortModal(false);
  // open CreateCohort Modal function
  const handleShowCreateCohortModal = () => setShowCreateCohortModal(true);
  // state for CohortDetails modal displaying/not displaying
  const [AddCohortStudentsModal, setAddCohortStudentsModal] = useState(false);
  // close CohortDetails modal function
  const handleCloseCohortDetailsModal = () => setAddCohortStudentsModal(false);
  // open CohortDetails modal function
  const handleAddCohortStudentsModal = () => setAddCohortStudentsModal(true);

  // references for fetch
  const instructorNameRef = useRef()
  const cohortNameRef = useRef()
  
  let createCohort = () => {
    fetch(`${url}/api/create/cohort`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newCohort: {
          name: cohortNameRef.current.value,
          begin_date: beginDate,
          end_date: endDate,
          instructor: instructorNameRef.current.value,
        }
      })
    })
    .then(result => result.json())
    .then(data => console.log(data))
    .then(() => {
      setBeginDate(null);
      setEndDate(null);
    })
    .then(swal(`Cohort was succesfully created`))
  }

  return (
    <>
      <Dropdown.Item id="btn-create-cohort" onClick={handleShowCreateCohortModal}><BsFileEarmarkCodeFill /> Create Cohort </Dropdown.Item>

      {/* CreateCohort Modal */}
      <Modal id="cohort-create-modal" size="lg" centered show={showCreateCohortModal} onHide={handleCloseCreateCohortModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Cohort</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Cohort Name: <input ref={cohortNameRef} type="text" name="cohortName" />
            Instructor Name:  <input ref={instructorNameRef} type="text" name="teamGID" />
            Start Date: <DatePicker
              selected={beginDate}
              onChange={date => setBeginDate(date)}
            />
            Graduation Date: <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
            />
            
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() =>  { createCohort(); handleCloseCreateCohortModal()}}>
            Submit
            </Button>
        </Modal.Footer>
      </Modal>

      {/* Add cohorts students modal
      <Modal id="add-cohort-students-modal" size="lg" centered show={AddCohortStudentsModal} onHide={c}>
        <Modal.Header closeButton>
        <Modal.Title>Cohort Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { handleCloseCohortDetailsModal(); handleShowCreateCohortModal() }}>Back</Button>
          <Button variant="primary" onClick={handleCloseCohortDetailsModal}>
            Submit ✓
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}