import React from "react";
import Logo from "../images/galvanize-logo.svg";
import { AdminMenu } from "./AdminMenu";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";

export const Header = (props) => {
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props;

  return (
    <>
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
          <AdminMenu
            courses={courses}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            className="admin-menu"
          />
        </Container>
      </Navbar>
      {/* <header>
        <img src={Logo} alt="Galvanize Logo" height={50} />
        <AdminMenu courses={courses} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </header> */}
    </>
  );
};
