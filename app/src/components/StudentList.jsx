import {StudentStats} from './StudentStats';
import {StudentAverages} from './StudentAverages';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import { useState } from 'react';


export const StudentList = (props) => {

  const { courses, setCourses } = props
  const [selectedClass, setSelectedClass] = useState('Courses')
//"Courses"
  return(
    <>
    <div id="select-cohort">
      <h2>Student List</h2>
      <DropdownButton
        align="end"
        title={selectedClass}
        menuVariant="dark"
        id="dropdown-menu-align-end"
        size="md"
        onSelect={function(evt){
          setSelectedClass(evt)
          sessionStorage.setItem('currentClass', evt)
        }}
      >
      {courses.map(course => <Dropdown.Item key={course.gid} eventKey={course.name}>{course.name}</Dropdown.Item>)}

    </DropdownButton>
    </div>
    <div id="student-list-container">
    <Table id="student-list" striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>GitHub</th>
          <th>Performance Averages (Learn/Team/Tech)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Dylan Clark</td>
          <td>@testuser</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="danger">30%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="warning">70%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Nate Morrison</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="danger">30%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="warning">70%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Katie Chevez</td>
          <td>@someotherusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="danger">30%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="warning">70%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Timothy Iott</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="danger">30%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="warning">70%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Adam Jones</td>
          <td>@someusername</td>
          <td className="student-average" width={'15%'}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary" size="sm">
              <Badge bg="success">95%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
            <Badge bg="success">100%</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
            <Button variant="secondary" size="sm">
              <Badge bg="success">100%</Badge>
                <span className="visually-hidden">unread messages</span>
            </Button>
          </ButtonGroup>
          </td>
        </tr>
      </tbody>
    </Table>
      <StudentAverages />
    </div>
    </>
    
  );
}
