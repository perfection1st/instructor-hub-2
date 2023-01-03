import React, { useState } from 'react';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";

export const CreateCohortModal = () => {
  // backend url 
  const url = "http://localhost:8000"

  // state for CreateCohort Modal displaying/not displaying
  const [showCreateCohortModal, setShowCreateCohortModal] = useState(false);
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
  // references for asana fetch body content
  const teamGIDRef = useRef()
  const cohortNameRef = useRef()
  const startDateRef = useRef()
  const graduationDateRef = useRef()

  function insertCohortDB(data){
    fetch(`${url}/api/create/cohort`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newCohort: {
          name: data.name,
          begin_date: data.start_on,
          end_date: data.due_on,
          instructor: sessionStorage.getItem('username'),
          gid: data.gid
        }
      })
    })
    .then(result => result.json())
    .then(data => console.log(data))
  }
  
  let createCohort = () => {
    let asanaToken = sessionStorage.getItem('asanaToken')
    console.log(instructorNameRef.current.value)
    props.setInstructor(instructorNameRef.current.value)
        // Make the API call using fetch
    fetch('https://app.asana.com/api/1.0/projects', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${asanaToken}`
        },
        body: JSON.stringify({
            data: {
                name: cohortNameRef.current.value,
                team: teamGIDRef.current.value,
                due_on: graduationDateRef.current.value,
                start_on: startDateRef.current.value,
                public: false
            }
        })
        })
        .then(result => result.json())
        .then((data) => {
            insertCohortDB(data.data)
        })
}

  return (
    <>
      <button id="btn-create-cohort" onClick={handleShowCreateCohortModal}><BsFileEarmarkCodeFill /> Create Cohort </button>

      {/* CreateCohort Modal */}
      <Modal id="cohort-create-modal" size="lg" centered show={showCreateCohortModal} onHide={handleCloseCreateCohortModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Cohort</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Asana Team GID:  <input ref={teamGIDRef} type="text" name="teamGID" />
            Cohort Name: <input ref={cohortNameRef} type="text" name="cohortName" />
            Instructor Name: <input ref={instructorNameRef} type="text" name="instructorName" />
            Start Date (YYYY-MM-DD): <input ref={startDateRef} type="text" name="startDate" />
            Graduation Date (YYYY-MM-DD): <input ref={graduationDateRef} type="text" name="graduationDate" />
            
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() =>  { createCohort(); handleCloseCreateCohortModal(); handleShowAddCohortStudentsModal() }}>
            Next
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