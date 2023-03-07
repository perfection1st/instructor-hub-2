import React, { useState } from "react";
// imported useContext to utilize context in children component
import { useRef, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";
import Form from "react-bootstrap/Form";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
// imported in cohort context from home component. 
import { CohortContext } from "../routes/Home";

export const CreateCohortModal = () => {
  // extracted dbCohorts function from cohortContext, using useContext. 
  const { dbCohorts } = useContext(CohortContext)
  // backend url
  const url = "http://localhost:8000";

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
  const instructorNameRef = useRef();
  const cohortNameRef = useRef();

  let createCohort = () => {
    fetch(`${url}/api/create/cohort`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newCohort: {
          name: cohortNameRef.current.value,
          begin_date: beginDate,
          end_date: endDate,
          instructor: instructorNameRef.current.value,
        },
      }),
    })
      .then((result) => result.json())
      .then((data) => console.log(data))
      .then(() => {
        setBeginDate(null);
        setEndDate(null);
      })
      .then(swal(`Cohort was succesfully created`))
      .then(() => {
        dbCohorts();
        // utilized function when data is posted and enter something into form field, call function again to make req to backend api and update states. when states get updated in react, they re-render the component. So cohort now applies in the webpage. 
      });
  };

  return (
    <>
      <Button className="btn" id="create-cohort-btn" onClick={handleShowCreateCohortModal}>
        <AiOutlineUsergroupAdd size={25} />
        Create New Cohort
      </Button>

      {/* CreateCohort Modal */}
      <Modal
        id="cohort-create-modal"
        size="md"
        centered
        show={showCreateCohortModal}
        onHide={handleCloseCreateCohortModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Cohort</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Cohort Name:</Form.Label>{" "}
              <Form.Control ref={cohortNameRef} type="text" name="cohortName" />
              <Form.Label>Instructor Name:</Form.Label>{" "}
              <Form.Control ref={instructorNameRef} type="text" name="instructorName" />
              Start Date:{" "}
              <DatePicker selected={beginDate} onChange={(date) => setBeginDate(date)} />
              Graduation Date:{" "}
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              createCohort();
              handleCloseCreateCohortModal();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
