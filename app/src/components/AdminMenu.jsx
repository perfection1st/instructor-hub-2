import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { GoGear, GoPerson, GoSignOut } from "react-icons/go";

export const AdminMenu = () => {
  return(
    <div id="admin-menu">
    <DropdownButton
      align="end"
      title="Admin"
      menuVariant="dark"
      id="dropdown-menu-align-end"
    >
      <Dropdown.Item eventKey="1"><GoGear /> Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4"><GoSignOut /> Logout</Dropdown.Item>
    </DropdownButton>
    </div>
  );
}