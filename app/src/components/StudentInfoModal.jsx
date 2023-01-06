import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import Table from 'react-bootstrap/Table';

export const StudentInfoModal = (props) => {
    // prop deconstruction for Student Info Modal displaying/not displaying
    const { showStudentInfoModal, setShowStudentInfoModal, grades, learnGrades } = props
    // close Student Info Modal function
    const handleCloseStudentInfoModal = () => setShowStudentInfoModal(false);

    
    useEffect(() => {

        console.log('grades', grades)
        console.log('learnGrades', learnGrades)
    }, [grades])

    return(
        <>
            <Modal id="student-info-modal" size="lg" centered show={showStudentInfoModal} onHide={handleCloseStudentInfoModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{grades[0].name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table id="student-list" striped>
                            <thead>
                                <tr>
                                    <th>Graded Content</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <th>Projects</th>
                                <> </>
                                {grades.map(test => <tr><td key={test.project_name}>{test.project_name}</td> <td key={test.project_id}>{test.project_passed ? 'Passed' : 'Failed'}</td></tr>)}
                                <> </>
                                <th>Assessments</th>
                                <> </>
                                {learnGrades.map(test => <tr><td key={test.assessment_name}>{test.assessment_name}</td><td key={test.assessment_id}>{test.assessment_grade}</td></tr>)}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => { handleCloseStudentInfoModal() }}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
        </>
    )
}
