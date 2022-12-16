import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { GoGear, GoSignOut } from "react-icons/go";

export const AdminMenu = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props

  let user = sessionStorage.getItem('username')
  function logout(){
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  return(
    <div id="admin-menu">
    <DropdownButton
      align="end"
      title={user}
      menuVariant="dark"
      id="dropdown-menu-align-end"
    >
      
      <Dropdown.Item eventKey="1"><GoGear /> Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4" onClick={() => logout()}><GoSignOut /> Logout</Dropdown.Item>
    </DropdownButton>
    </div>
  );
}