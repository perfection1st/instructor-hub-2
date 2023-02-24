import React from 'react';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { GoGear, GoSignOut } from "react-icons/go";
import { CreateCohortModal } from './CreateCohortModal';
import { AddStudentModal } from './AddStudentsModal';

export const AdminMenu = (props) => {
  const URL = 'http://localhost:8000/api'
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props

  let user = sessionStorage.getItem('username');

  function logout(){
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  // Settings Modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleCloseSettingsModal = () => setShowSettingsModal(false);
  const handleShowSettingsModal = () => setShowSettingsModal(true);

  const [defaultCohort, setDefaultCohort] = useState('')
  function handleCohortChange(e){
    setDefaultCohort(e.target.value)
  }

  function changeDefaultCohort(){
    if(defaultCohort == 0 || defaultCohort == ''){
      swal('No Cohort Selected')
    } else {
      fetch(`${URL}/default-cohort`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          default_cohort: defaultCohort,
          username: sessionStorage.getItem('username')
        })
        })
        .then(result => result.json())
        .then(data => {
          console.log('data', data)
          handleCloseSettingsModal()
        })
      }
    }


  return(
    <div id="admin-menu">
      <Modal id="modal-settings" show={showSettingsModal} onHide={handleCloseSettingsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
        <Form.Select aria-label="Select Default Cohort" onChange={(e) => handleCohortChange(e)}>
          <option value={0}>Select Default Cohort</option>
          {courses.map(course => <option key={course.cohort_name} value={course.cohort_name}>{course.cohort_name}</option>)}
        </Form.Select>
          
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettingsModal}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => changeDefaultCohort(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    <DropdownButton
      align="end"
      title={user || 'User'}
      menuVariant="dark"
      id="dropdown-menu-align-end"
    >
      <CreateCohortModal />
      <AddStudentModal />
      <Dropdown.Item eventKey="1" onClick={handleShowSettingsModal}><GoGear /> Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4" onClick={() => logout()}><GoSignOut /> Logout</Dropdown.Item>
    </DropdownButton>
    </div>
  );
}