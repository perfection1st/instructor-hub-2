import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsFillPersonPlusFill } from "react-icons/bs";
import swal from 'sweetalert';

export const AddStudentModal = () => {
    const URL = "http://localhost:8000"

    const [students, setStudents] = useState([])

    //Handles the opening and closing of the modal to add students
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => setShowModal(false)
    const openModal = () => setShowModal(true)

    //Refs used for the inputs to add students
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const githubUserRef = useRef()

    useEffect(() => {
        console.log(students)
    }, ['useEffect students:', students])
 
    function submitStudents(){
        let cohort = sessionStorage.getItem('currentClass')
        let firstName = firstNameRef.current.value;
        let lastName = lastNameRef.current.value;
        let githubUser = githubUserRef.current.value;
        console.log(firstName, lastName, githubUser)
        if (!cohort){
            swal('Please select a class to add students')
        } else if ( firstName !== '' && lastName !== '' && githubUser !== ''){
            swal('Must finish adding student to submit')
        } else if (students.length <= 0){
            swal('No students to add')
        } else {
            console.log(students)
            fetch(`${URL}/api/create/students`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  students: students
                })
            })
            .then(result => result.json())
            .then((data) => {
                swal('Students added!')
                setStudents([])    
                closeModal()
            })
        }
    }

    function addStudents(){
        let firstName = firstNameRef.current.value;
        let lastName = lastNameRef.current.value;
        let githubUser = githubUserRef.current.value;
        if(firstName == '' || lastName == '' || githubUser == ''){
            swal('Please fill out all fields')
        } else {
            setStudents([...students, {"name": `${firstName} ${lastName}`, "cohort_name": sessionStorage.getItem('currentClass'), "github": `${githubUser}`}])
            clearInput()    
        }
    }
    function clearInput() {
        firstNameRef.current.value = '';
        lastNameRef.current.value = '';
        githubUserRef.current.value = '';
    }


    return (
        <>
            <Dropdown.Item id="btn-create-cohort" onClick={() => openModal()}><BsFillPersonPlusFill />  Add Students </Dropdown.Item>

            <Modal id="add-student-modal" size="lg" centered show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Students - {sessionStorage.getItem('currentClass') ? 'Adding To ' + sessionStorage.getItem('currentClass') : 'No Cohort Selected'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    First Name: <input ref={firstNameRef} type="text" name="firstName" />
                    Last Name:  <input ref={lastNameRef} type="text" name="lastName" />
                    Github:  <input ref={githubUserRef} type="text" name="github" />
                    <></>
                    <ul>
                        Adding these students:
                        {students.length > 0 ? students.map(student => <li key={student.github}>Name: {student.name} Github: {student.github}</li>) : <li>No current students</li>}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() =>  {
                        addStudents()
                        }}>
                        Add Another Student
                    </Button>
                    <Button variant="primary" onClick={() =>  {
                        submitStudents()
                        }}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}