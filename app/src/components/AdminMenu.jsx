import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { GoGear, GoSignOut } from "react-icons/go";
import { CreateCohortModal } from './CreateCohortModal';

export const AdminMenu = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props

  let user = sessionStorage.getItem('username')
  function logout(){
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  // Settings Modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleCloseSettingsModal = () => setShowSettingsModal(false);
  const handleShowSettingsModal = () => setShowSettingsModal(true);

  return(
    <div id="admin-menu">
      <Modal id="modal-settings" show={showSettingsModal} onHide={handleCloseSettingsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          
        <Form.Select aria-label="Select Default Cohort">
          <option>Select Default Cohort</option>
          <option value="1">MCSP-15</option>
          <option value="2">MCSP-14</option>
          <option value="3">MCSP-13</option>
        </Form.Select>
          
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettingsModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseSettingsModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    <DropdownButton
      align="end"
      title={user}
      menuVariant="dark"
      id="dropdown-menu-align-end"
    >
      
      <Dropdown.Item eventKey="1" onClick={handleShowSettingsModal}><GoGear /> Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item > <CreateCohortModal /></Dropdown.Item>
      <Dropdown.Item eventKey="4" onClick={() => logout()}><GoSignOut /> Logout</Dropdown.Item>
    </DropdownButton>
    </div>
  );
}