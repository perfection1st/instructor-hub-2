import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import { BsGrid3X2Gap } from 'react-icons/bs';

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

    return (
        <>
            <Button onClick={() => students.length < 1 ? swal('No cohort selected') : handleShowGenerateGroupsModal()}><BsGrid3X2Gap /> Generate Groups</Button>

            {/* Generate Groups Modal */}
            <Modal id="generate-group-modal" size="md" centered show={showGenerateGroupsModal} onHide={handleCloseGenerateGroupsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Generate Groups</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="input-container">
                        Number of Groups: <input ref={numOfGroupRef} type="text" name="numOfGroups" />
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { loadGroups(); handleCloseGenerateGroupsModal(); handleShowShowGroupsModal() }}>
                        Generate Groups
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal id="show-groups-modal" size="lg" centered show={showShowGroupsModal} onHide={handleCloseShowGroupsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Groups</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {groupArray.map((group, index) =>
                        <div key={index}>
                            <p>Group {groupCounter}</p>
                            <ul key={groupCounter}>{group.map(student =>
                                <li key={student.github}>{student.name}</li>)}</ul>
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