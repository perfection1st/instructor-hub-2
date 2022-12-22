import React, { useState } from 'react';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFileEarmarkCodeFill } from "react-icons/bs";

export const CreateCohortModal = () => {

  // state for CreateCohort Modal displaying/not displaying
  const [showCreateCohortModal, setShowCreateCohortModal] = useState(false);
  // close CreateCohort Modal function
  const handleCloseCreateCohortModal = () => setShowCreateCohortModal(false);
  // open CreateCohort Modal function
  const handleShowCreateCohortModal = () => setShowCreateCohortModal(true);

  // state for CohortDetails modal displaying/not displaying
  const [showCohortDetailsModal, setShowCohortDetailsModal] = useState(false);
  // close CohortDetails modal function
  const handleCloseCohortDetailsModal = () => setShowCohortDetailsModal(false);
  // open CohortDetails modal function
  const handleShowCohortDetailsModal = () => setShowCohortDetailsModal(true);
  
  // references for asana fetch body content
  const teamGIDRef = useRef()
  const cohortNameRef = useRef()
  const instructorName = useRef()
  const startDate = useRef()
  const graduationDate = useRef()



  let createCohort = () => {
    let asanaToken = sessionStorage.getItem('asanaToken')
    console.log(cohortNameRef.current.value)
    console.log(teamGIDRef.current.value)
        // Make the API call using fetch
    fetch('https://app.asana.com/api/1.0/projects', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${asanaToken}`
        },
        body: JSON.stringify({
            data: {
                name: cohortNameRef.current.value,
                team: teamGIDRef.current.value
            }
        })
        })
        .then(result => result.json())
        .then((data) => {
            console.log(data)})
}

  return (
    <>
      <div id="btn-create-cohort" onClick={handleShowCreateCohortModal}><BsFileEarmarkCodeFill /> Create Cohort </div>

      {/* CreateCohort Modal */}
      <Modal id="cohort-create-modal" size="lg" centered show={showCreateCohortModal} onHide={handleCloseCreateCohortModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Cohort</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Asana Team GID:  <input ref={teamGIDRef} type="text" name="teamGID" />
            Cohort Name: <input ref={cohortNameRef} type="text" name="cohortName" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() =>  { createCohort(); handleCloseCreateCohortModal(); handleShowCohortDetailsModal() }}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cohort details modal */}
      {/* <Modal id="cohort-details-modal" size="md" centered show={showCohortDetailsModal} onHide={c}>
        <Modal.Header closeButton>
        <Modal.Title>Cohort Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Instructor Name: <input ref={instructorName} type="text" name="instructorName" />
        Start Date (YYYY-MM-DD): <input ref={startDate} type="text" name="startDate" />
        Graduation Date (YYYY-MM-DD): <input ref={graduationDate} type="text" name="graduationDate" />
          
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