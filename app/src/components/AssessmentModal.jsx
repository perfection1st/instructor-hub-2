import React, { useState, useRef } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsBarChartLineFill } from "react-icons/bs";
import { ModalList } from "./ModalList";
import swal from "sweetalert";

export const AssessmentModal = (props) => {
  const {
    courses,
    setCourses,
    checked,
    setChecked,
    selectedStudents,
    setSelectedStudents,
    studentData,
    setStudentData,
  } = props;
  const URL = "http://localhost:8000";

  // state for assessment modal displaying/not displaying
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  // state for assessment grading modal displaying/not displaying
  const [showAssessmentGradingModal, setShowAssessmentGradingModal] =
    useState(false);
  // state for storing all of the assessment names that are fetched from the database
  const [allAssessmentNames, setAllAssessmentNames] = useState([]);
  // state for storing the current assessment name that is selected
  const [currentSelectedAssessmentName, setCurrentSelectedAssessmentName] =
    useState("");
  // state for storing the current assessment ID that is selected
  const [currentSelectedAssessmentID, setCurrentSelectedAssessmentID] =
    useState(0);
  // state for storing the current grades from the learn grades table
  const [currentLearnGrades, setCurrentLearnGrades] = useState([]);

  // this function sets the currentSelectedAssessmentName and currentSelectedAssessmentID states for the selected assessment
  const handleSelectAssessment = (e) => {
    setCurrentSelectedAssessmentName(e.target.value);
    const selectedAssessment = allAssessmentNames.find(
      (assessment) => assessment.assessment_name === e.target.value
    );
    setCurrentSelectedAssessmentID(selectedAssessment.assessment_id);
  };

  //this function sets the selected grade for the respective student and assigns it to the selected students state
  const handleSelectAssessmentGrade = (e, student_id) => {
    setSelectedStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.student_id === student_id) {
          return {
            ...student,
            learnGrade: parseInt(e.target.value),
          };
        }
        return student;
      })
    );
  };

  /////////////////// ASSESSMENT MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close assessment modal function
  const handleCloseAssessmentModal = () => {
    setCurrentSelectedAssessmentName("");
    setCurrentSelectedAssessmentID(0);
    setSelectedStudents([]);
    setShowAssessmentModal(false);
  };

  // open assessment modal function
  const handleShowAssessmentModal = () => {
    fetch(`${URL}/api/learn/assessment-names`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllAssessmentNames(data);
      });
      
      fetch(`${URL}/api/learn-grades`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCurrentLearnGrades(data);
        });
    setShowAssessmentModal(true);
  };

  /////////////////// ASSESSMENT GRADING MODAL OPEN AND CLOSE FUNCTIONS ///////////////////
  // close assessment grading modal function
  const handleCloseAssessmentGradingModal = () => {
    setCurrentSelectedAssessmentName("");
    setCurrentSelectedAssessmentID(0);
    setSelectedStudents([]);
    setShowAssessmentGradingModal(false);
  };

  // open assessment grading modal function
  const handleShowAssessmentGradingModal = () => {
    fetch(`${URL}/api/learn-grades`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentLearnGrades(data);
      });
    setShowAssessmentGradingModal(true);
  };

  /////////////////// NEXT, BACK, and SUBMIT BUTTON FUNCTIONS ///////////////////
  // switch between assessment modal and the assessment grading modal
  const handleNextModal = () => {
    setShowAssessmentModal(false);
    handleShowAssessmentGradingModal();
  };

  // go back from the assessment grading modal to the assessment modal
  const handleBackButton = () => {
    setSelectedStudents([]);
    setShowAssessmentGradingModal(false);
    setShowAssessmentModal(true);
  };

  // submit the data to the database
  const handleSubmitButton = () => {
    //filters all of the values that are already in the database
    let filteredStudentsWhoAlreadyHaveGrades = selectedStudents.filter(
      (student) => {
        for (let i = 0; i < currentLearnGrades.length; i++) {
          if (
            currentLearnGrades[i].student_id == student.student_id &&
            currentLearnGrades[i].assessment_id == currentSelectedAssessmentID
          ) {
            return true;
          }
        }
        return false;
      }
    );

    //filters all of the values that are not already in the database
    let filteredStudentsWhoDoNotAlreadyHaveGrades = selectedStudents.filter(
      (student) => {
        for (let i = 0; i < currentLearnGrades.length; i++) {
          if (
            currentLearnGrades[i].student_id == student.student_id &&
            currentLearnGrades[i].assessment_id == currentSelectedAssessmentID
          ) {
            return false;
          }
        }
        return true;
      }
    );

    // sends a fetch call to post learn grades for all selected students who do not already have grades in the database
    // this will only fire the fetch call if the filteredStudentsWhoDoNotAlreadyHaveGrades variable has a value in it
    if (filteredStudentsWhoDoNotAlreadyHaveGrades.length > 0) {
      fetch(`${URL}/api/application-update/learn-grades-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          students: filteredStudentsWhoDoNotAlreadyHaveGrades.map(
            (student) => ({
              student_id: student.student_id,
              assessment_id: currentSelectedAssessmentID,
              assessment_grade: student.learnGrade,
            })
          ),
        }),
      })
        .then((result) => result.json())
        .then((data) => {
          swal("learn grades posted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // sends a fetch call to update learn grades for all selected students who already have grades in the database
    // this will only fire the fetch call if the filteredStudentsWhoAlreadyHaveGrades variable has a value in it
    if (filteredStudentsWhoAlreadyHaveGrades.length > 0) {
      fetch(`${URL}/api/application-update/learn-grades-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          students: filteredStudentsWhoAlreadyHaveGrades.map((student) => ({
            student_id: student.student_id,
            assessment_id: currentSelectedAssessmentID,
            assessment_grade: student.learnGrade,
          })),
        }),
      })
        .then((result) => result.json())
        .then((data) => {
          swal("learn grades posted successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    handleCloseAssessmentGradingModal();
  };

  return (
    <>
      <button
        id="btn-assessment-update"
        onClick={() => {
          let currentClass = sessionStorage.getItem("currentClass");
          if (!currentClass) {
            setShowAssessmentModal(false);
            swal("No cohort selected");
          } else {
            handleShowAssessmentModal();
          }
        }}
      >
        <BsBarChartLineFill /> Assessments
      </button>

      {/* Assessment modal */}
      <Modal
        id="assessment-update-modal"
        size="md"
        centered
        show={showAssessmentModal}
        onHide={handleCloseAssessmentModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            id="assessment-selector"
            name="assessments"
            onChange={(e) => handleSelectAssessment(e)}
          >
            <option value="placeholder">
              {currentSelectedAssessmentName === ""
                ? "-- Select Assessment --"
                : currentSelectedAssessmentName}
            </option>
            {allAssessmentNames.map((names) => {
              if (currentSelectedAssessmentName === names.assessment_name) {
                return;
              }
              return (
                <option key={names.assessment_id} value={names.assessment_name}>
                  {names.assessment_name}
                </option>
              );
            })}
          </select>
          <ul id="assessment-student-list">
            <ModalList
              courses={courses}
              setShowAssessmentModal={setShowAssessmentModal}
              checked={checked}
              setChecked={setChecked}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
            />
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleNextModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assessment Grading modal */}
      <Modal
        id="assessment-grading-modal"
        size="md"
        centered
        show={showAssessmentGradingModal}
        onHide={handleCloseAssessmentGradingModal}
      >
        <Modal.Header closeButton>
          {/* assessment name displayed based of selection on previous modal */}
          <Modal.Title>
            Selected Assessment Grades For:
            <br />
            {currentSelectedAssessmentName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="assessment-grade-input">
            <ul id="assessment-selected-students">
              {/* student names displayed based off students selected from previous modal */}
              {selectedStudents.map((student) => (
                <li key={student.student_id} value={student.student_id}>
                  {student.name}
                  {/* adds a space between the name and dropdown */}
                  <> </>
                  <input
                    type="number"
                    max="100"
                    min="0"
                    defaultValue={student.learnGrade}
                    onChange={(e) =>
                      handleSelectAssessmentGrade(e, student.student_id)
                    }
                  />
                </li>
              ))}
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
  );
};
