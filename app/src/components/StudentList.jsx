import {StudentStats} from './StudentStats';
import {StudentAverages} from './StudentAverages';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export const StudentList = () => {
  return(
    <>
    <div id="select-cohort">
      <h2>Student List</h2>
      <DropdownButton
        align="end"
        title="MCSP-15"
        variant="secondary"
        menuVariant="dark"
        id="dropdown-menu-align-end"
        size="md"
      >
      <Dropdown.Item eventKey="1">MCSP-14</Dropdown.Item>
      <Dropdown.Item eventKey="4">MCSP-13</Dropdown.Item>
    </DropdownButton>
    </div>
    <div id="student-list-container">
      <ul id="students">
        <li>
          <h3>Dylan Clark</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Elijah Stamp</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Katie "Chevy" Chevez</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Nathaniel "Nate" Morrison</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Timothy "Timotheus" Iott</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Adam "Jones" Jones</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
      </ul>
      <StudentAverages />
    </div>
    </>
    
  );
}
