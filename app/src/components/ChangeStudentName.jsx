import React from "react";
import { useState, useRef, useEffect } from "react";
import swal from "sweetalert"; // Sweetalert library for displaying alerts
import { BsPencilFill } from "react-icons/bs"; // React-icons library for pencil icon
import "../css/ChangeStudentName.css"; // CSS styles for the component

// Function component to change a student's name
export const ChangeStudentName = (props) => {
  const URL = "http://localhost:8000"; // API URL
  const [studentNewName, setStudentNewName] = useState(); // State to store the new name of the student
  const [isClicked, setIsClicked] = useState(false); // State to store if the pencil icon has been clicked or not

  // Destructuring props
  const { clickedStudent, setClickedStudent, loadStudents } = props; 

  // Ref to access the input element
  const newNameRef = useRef(); 

  // Function to handle the change of the student's name
  function ChangeName() {
    let newName = newNameRef.current.value; // Get the new name from the input
    let nameRegex = /^([a-zA-ZÀ-ÿ]+)(\s[a-zA-ZÀ-ÿ]+)?\s([a-zA-ZÀ-ÿ]+)$/; // Regular expression for name validation
    // If the new name does not match the name format
    if (!nameRegex.test(newName)) {
      swal("Write your first name, optional middle, and last name with one space in between ONLY!"); // Show an error alert
    } else {
      // Update the state with the new name and other details
      setStudentNewName({
        name: `${newName}`,
        cohort_name: sessionStorage.getItem("currentClass"),
        oldName: clickedStudent,
      });
      setClickedStudent(newName); // Update the clicked student's name
      // Send a PATCH request to the API to update the student's name
      fetch(`${URL}/api/students/nameChange`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: `${newName}`,
          cohort_name: sessionStorage.getItem("currentClass"),
          oldName: clickedStudent,
        }),
      }).then(() => {
        swal("Name Changed!"); // Show a success alert
        loadStudents(sessionStorage.getItem("currentClass")); // Load the updated list of students
      });
    }
  }

  // Function to handle the click event on the pencil icon
  const handleClick = () => {
    setIsClicked(!isClicked); // Flip the value of the isClicked state
  };

  return (
    <div className="pen-change-name">
      {/* This component displays the pencil icon for changing student name */}
      <a className="pen" onClick={handleClick}>
        <BsPencilFill />
      </a>
      {/* This component displays the input field for the new name and save button if the pencil is clicked, 
      otherwise it displays the text "Change Name" */}
      {isClicked ? (
        <div className="pen-input">
          <input
            className="form-control"
            placeholder="Enter New First & Last Name"
            ref={newNameRef}
            type="text"
            name="name"
          ></input>
          <button
            className="btn btn-primary"
            onClick={() => {
              ChangeName();
              handleClick();
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <p className="change-text">Change Name </p>
      )}
    </div>
  );
};