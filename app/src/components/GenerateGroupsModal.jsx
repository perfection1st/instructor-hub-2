import React, { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { BsGrid3X2Gap } from 'react-icons/bs';
import { IoIosCopy } from "react-icons/io";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';

export const GenerateGroupsModal = (props) => {
    const { students } = props
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
    const numOfGroupRef = useRef()

    const url = "http://localhost:8000"

    // splits students into the given amount of groups and assigns them to the groups useState
    function splitIntoGroups(students, numGroups) {
        const groups = [];
        for (let i = 0; i < numGroups; i++) {
            groups.push([]);
        }
        while (students.length > 0) {
            const student = students.splice(Math.floor(Math.random() * students.length), 1)[0];
            let groupIndex = 0;
            let minSize = Number.MAX_VALUE;
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].length < minSize) {
                    groupIndex = i;
                    minSize = groups[i].length;
                }
            }
            groups[groupIndex].push(student);
        }
        setGroupArray(groups);
    }
    useEffect(() => {
    }, [groupArray])

    // calls splitIntoGroups function
    function loadGroups() {
        let studentsCopy = students.slice(0)
        console.log(studentsCopy)
        console.log(students)
        splitIntoGroups(studentsCopy, numOfGroupRef.current.value)
    }

    // group counter for displaying each group
    let groupCounter = 1
    // increments group counter
    function countGroup() {
        groupCounter++
    }

    // Adds ability to copy groups to clipboard
        const studentGroupsRef = useRef(null);
      
        const copyToClipboard = () => {
          const text = studentGroupsRef.current.innerText;
          navigator.clipboard.writeText(text).then(
            function() {
              console.log("Text copied to clipboard successfully!");
            },
            function(err) {
              console.error("Failed to copy text: ", err);
            }
          );
        };

    // Copy groups tooltip
    const [showCopyTooltip, setShowCopyTooltip] = useState(false);
    const refCopyTooltip = useRef(null);

    return (
        <>
            <Button id="generate-group-btn" onClick={() => students.length < 1 ? swal('No cohort selected') : handleShowGenerateGroupsModal()}><BsGrid3X2Gap /> Generate Groups</Button>
            {/* Generate Groups Modal */}
            <Modal id="generate-group-modal" size="sm" centered show={showGenerateGroupsModal} onHide={handleCloseGenerateGroupsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Generate Groups</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Number of Groups:</Form.Label> <Form.Control ref={numOfGroupRef} type="text" name="numOfGroups" />
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { loadGroups(); handleCloseGenerateGroupsModal(); handleShowShowGroupsModal() }}>
                        Generate Groups
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal scrollable={true} id="show-groups-modal" size="lg" centered show={showShowGroupsModal} onHide={handleCloseShowGroupsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Groups
        <OverlayTrigger
          key="right"
          placement="right"
          overlay={
            <Tooltip id="copy-tooltip">
              Copy to Clipboard
            </Tooltip>
          }
        >
          <Button id="copy-groups-btn" className="btn-lg"><IoIosCopy id="copy-groups" onClick={copyToClipboard} /></Button>
        </OverlayTrigger>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body id="groups-modal-body" ref={studentGroupsRef}>
                    {groupArray.map((group, index) =>
                        <div key={index}>
                            <h4 className="student-group-heading">Group {groupCounter}</h4>
                            <ul className="student-group" key={groupCounter}>{group.map(student =>
                                <li key={student.github}>{student.name}</li>)}</ul> <br />
                            {countGroup()}
                        </div>)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { handleCloseShowGroupsModal() }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}