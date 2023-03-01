import React from "react";
import { useState, useRef, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsFillPersonPlusFill } from "react-icons/bs";
import swal from "sweetalert";
import Form from "react-bootstrap/Form";

export const AddStudentModal = () => {
  const URL = "http://localhost:8000";

  const [students, setStudents] = useState([]);

  //Handles the opening and closing of the modal to add students
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  //Refs used for the inputs to add students
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const githubUserRef = useRef();

  //Creates a function that submits a fetch call to add the students to the database
  //Takes place when the submit button is hit
  function submitStudents() {
    //Gets all of the information to send in the fetch
    let cohort = sessionStorage.getItem("currentClass");
    let firstName = firstNameRef.current.value;
    let lastName = lastNameRef.current.value;
    let githubUser = githubUserRef.current.value;
    //Checks to see if a class is selected, if it isn't sends a warning
    if (!cohort) {
      swal("Please select a class to add students");
      //Ensures that all students are added to the array, if anything is in the input box it doesn't send
    } else if (firstName !== "" && lastName !== "" && githubUser !== "") {
      swal("Must finish adding student to submit");
      //Will not send if there is nothing in the students array
    } else if (students.length <= 0) {
      swal("No students to add");
    } else {
      //Sends the student array, it is an array of objects
      //The route is set up to handle the array and do a mass query
      fetch(`${URL}/api/create/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: students,
        }),
      })
        .then((result) => result.json())
        //Gets the data back and lets the user know the students were added
        //Then it clears out the array and closes the modal for the next input
        .then(() => {
          swal("Students added!");
          setStudents([]);
          closeModal();
        });
    }
  }

  //Function to add the input students into the array to be sent as a fetch
  //Called when the add another student button is clicked
  function addStudents() {
    let firstName = firstNameRef.current.value;
    let lastName = lastNameRef.current.value;
    let githubUser = githubUserRef.current.value;
    //Makes sure that all sections are filled out before adding to the state
    if (firstName == "" || lastName == "" || githubUser == "") {
      swal("Please fill out all fields");
    } else {
      //Once all inputs are filled out and the button is clicked it adds all the info to the students state
      //The state takes all the prior inputs then adds the new one to the end
      //After doing that it clears out the input boxes
      setStudents([
        ...students,
        {
          name: `${firstName} ${lastName}`,
          cohort_name: sessionStorage.getItem("currentClass"),
          github: `${githubUser}`,
        },
      ]);
      clearInput();
    }
  }
  //Called when add another student button is clicked and the student is added to the list
  //Once the new student is added it clears out the input fields
  function clearInput() {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    githubUserRef.current.value = "";
  }

  return (
    <>
      {/* <Dropdown.Item id="btn-create-cohort" onClick={() => openModal()}><BsFillPersonPlusFill />  Add Students </Dropdown.Item> */}
      <Button id="add-student-btn" onClick={() => openModal()}>
        <BsFillPersonPlusFill />Add a Student
      </Button>

      <Modal id="add-student-modal" size="md" centered show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Add Students -{" "}
            {sessionStorage.getItem("currentClass")
              ? "Adding To " + sessionStorage.getItem("currentClass")
              : "No Cohort Selected"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>First Name:</Form.Label>{" "}
            <Form.Control ref={firstNameRef} type="text" name="firstName" />
            <Form.Label>Last Name:</Form.Label>{" "}
            <Form.Control ref={lastNameRef} type="text" name="lastName" />
            <Form.Label>Github:</Form.Label>{" "}
            <Form.Control ref={githubUserRef} type="text" name="github" />
          </Form>
          <ul>
            Adding these students:
            {students.length > 0 ? (
              students.map((student) => (
                <li key={student.github}>
                  Name: {student.name} Github: {student.github}
                </li>
              ))
            ) : (
              <li>No current students</li>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              addStudents();
            }}
          >
            Add Student
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitStudents();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
