import React, { useEffect, useState } from "react";
import { AdminMenu } from "./AdminMenu";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { LoadingDropdown } from "./Loading";

export const Header = (props) => {
  const URL = "http://localhost:8000/api";
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props;
  const [selectedClass, setSelectedClass] = useState("Cohorts");
  const [students, setStudents] = useState([]);

  // Sort the cohorts in the Cohorts dropdown menu in ascending order
  // courses.sort((a, b) => {
  //   const aCohortNum = Number(a.cohort_name.match(/([0-9])/g).join(""));
  //   const bCohortNum = Number(b.cohort_name.match(/([0-9])/g).join(""));
  //   return aCohortNum - bCohortNum;
  // });

  function loadStudents(e) {
    fetch(`${URL}/students/${e}`)
      .then((result) => result.json())
      .then((data) => setStudents(data));
    location.reload();
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <div id="navbar-left-container">
          <Navbar.Brand href="/" className="navbar-title">
            Galvanize Instructor Hub
          </Navbar.Brand>
          <Nav className="nav-links">
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/projects">Projects</Nav.Link>
            <Nav.Link href="/assessments">Assessments</Nav.Link>
          </Nav>
        </div>
        <div id="navbar-right-container">
          <DropdownButton
            align="end"
            title={selectedClass}
            id="dropdown-menu-align-end"
            size="md"
            onSelect={(e) => {
              setSelectedClass(e);
              sessionStorage.setItem("currentClass", e);
              loadStudents(e);
            }}
          >
            {isLoadingCourses ? (
              <LoadingDropdown />
            ) : (
              courses.map((course) => (
                <Dropdown.Item key={course.cohort_id} eventKey={course.cohort_name}>
                  {course.cohort_name}
                </Dropdown.Item>
              ))
            )}
          </DropdownButton>
          <AdminMenu
            courses={courses}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            className="admin-menu"
          />
        </div>
      </Container>
    </Navbar>
  );
};
