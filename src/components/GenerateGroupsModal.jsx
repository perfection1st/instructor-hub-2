import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosCopy } from "react-icons/io";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";

export const GenerateGroupsModal = ({ students }) => {
  // const { students } = props
  // ***** change to props instead of using fetch *** //

  // state for Generate Groups Modal displaying/not displaying
  const [showGenerateGroupsModal, setShowGenerateGroupsModal] = useState(false);
  // close Generate Groups Modal function
  const handleCloseGenerateGroupsModal = () => setShowGenerateGroupsModal(false);
  // open Generate Groups Modal function
  const handleShowGenerateGroupsModal = () => setShowGenerateGroupsModal(true);
  // state for Show Groups Modal displaying/not displaying
  const [showShowGroupsModal, setShowShowGroupsModal] = useState(false);
  // close Show Groups Modal function
  const handleCloseShowGroupsModal = () => setShowShowGroupsModal(false);
  // open Show Groups Modal function
  const handleShowShowGroupsModal = () => setShowShowGroupsModal(true);
  // state for array of groups
  const [groupArray, setGroupArray] = useState([]);
  // useRef for number of groups
  const numOfGroupRef = useRef();

  const URL = "http://localhost:8000/api";

  // splits students into the given amount of groups and assigns them to the groups useState
  const groups = [];
  function splitIntoGroups(students, numGroups) {
    for (let i = 0; i < numGroups; i++) {
      groups.push([]);
    }
    while (students.length > 0) {
      const student = students.splice(Math.floor(Math.random() * students.length), 1)[0];
      let groupIndex = 0;
      let minSize = numGroups;
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].length < minSize) {
          groupIndex = i;
          minSize = groups[i].length;
        }
      }
      groups[groupIndex].push(student);
    }
    setGroupArray(groups);
    // console.log(groups);
  }

  // Posts the randomly generated groups
  function postGroups() {
    const currentCohort = sessionStorage.currentClass || sessionStorage.defaultCohort;
    fetch(`${URL}/post-groups`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groups,
        currentCohort,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        console.log("data", data);
      });
  }

  // calls splitIntoGroups function
  function loadGroups() {
    let studentsCopy = students.slice(0);
    splitIntoGroups(studentsCopy, numOfGroupRef.current.value);
  }

  // group counter for displaying each group
  let groupCounter = 1;
  // increments group counter
  function countGroup() {
    groupCounter++;
  }

  // Adds ability to copy groups to clipboard
  const studentGroupsRef = useRef(null);

  const copyToClipboard = () => {
    const text = studentGroupsRef.current.innerText;
    navigator.clipboard.writeText(text).then(
      function () {
        swal("Copied to clipboard");
      },
      function (err) {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  // Copy groups tooltip
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const refCopyTooltip = useRef(null);

  return (
    <>
      <Button
        id="generate-group-btn"
        onClick={() =>
          students.length < 1 ? swal("No cohort selected") : handleShowGenerateGroupsModal()
        }
      >
        <HiOutlineUserGroup size={20} color="white" /> Generate Groups
      </Button>
      {/* Generate Groups Modal */}
      <Modal
        id="generate-group-modal"
        size="sm"
        centered
        show={showGenerateGroupsModal}
        onHide={handleCloseGenerateGroupsModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Generate Groups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Number of Groups:</Form.Label>{" "}
            <Form.Control ref={numOfGroupRef} type="text" name="numOfGroups" />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              loadGroups();
              handleCloseGenerateGroupsModal();
              handleShowShowGroupsModal();
              postGroups();
              console.log(groups);
            }}
          >
            Generate Groups
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        scrollable={true}
        id="show-groups-modal"
        size="lg"
        centered
        show={showShowGroupsModal}
        onHide={handleCloseShowGroupsModal}
      >
        <Modal.Header closeButton>
          <Modal.Title id="groups-modal-title">
            Groups
            <OverlayTrigger
              key="right"
              placement="right"
              overlay={<Tooltip id="copy-tooltip">Copy to Clipboard</Tooltip>}
            >
              <Button id="copy-groups-btn" className="btn-lg">
                <IoIosCopy id="copy-groups" onClick={copyToClipboard} />
              </Button>
            </OverlayTrigger>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="groups-modal-body" ref={studentGroupsRef}>
          {groupArray.map((group, index) => (
            <div key={index}>
              <h4 className="student-group-heading">Group {groupCounter}</h4>
              <ul className="student-group" key={groupCounter}>
                {group.map((student) => (
                  <li key={student.github}>{student.name}</li>
                ))}
              </ul>{" "}
              <br />
              {countGroup()}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseShowGroupsModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
