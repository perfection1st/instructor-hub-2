import "../css/Login.css";
import { Navigate, Link } from "react-router-dom";
import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import "../images/galvanize-logo.svg";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import InputGroup from "react-bootstrap/InputGroup";

export const Login = (props) => {
  const URL = "http://localhost:8000/api";

  const { isLoggedIn, setIsLoggedIn } = props;
  const emailRef = useRef();
  const passwordRef = useRef();

  //useState for shoe/hide password
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  // if statement for password icon toggle
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  //Does not take user to home page yet
  //Does a fetch call on log in click that sends the users password and username to authent
  function signIn(e) {
    e.preventDefault();
    setIsLoading(true);
    //Gives the loading state time to load
    setTimeout(() => {
      loginHandler();
    }, 1000);
  }
  const loginHandler = () => {
    let inputEmail = emailRef.current.value;
    let inputPassword = passwordRef.current.value;
    //Checks to ensure both a username and password were input
    if (!inputEmail || !inputPassword) {
      swal("Both username and Paswword are required");
      setIsLoading(false);
    } else {
      //Sends a request to the login to verify username and password
      fetch(`${URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //TODO change to email
          email: `${inputEmail}`,
          password: `${inputPassword}`,
        }),
      })
        .then((result) => result.json())
        .then((data) => verifyLogin(data));
    }
  };
  //Verifies that the user was logged in
  //If the response is not the users information it gives an alert
  //If login was successful it sets session storage to users info
  function verifyLogin(data) {
    let info = data;
    console.log(info);
    if (info.response === "Incorrect Email") {
      swal("Incorrect Email");
      setIsLoading(false);
    } else if (info.response === "Wrong Password") {
      swal("Incorrect Password");
      setIsLoading(false);
    } else {
      //TODO change to email
      sessionStorage.setItem("username", info.email);
      sessionStorage.setItem("userToken", info.accessToken);
      info.cohort
        ? sessionStorage.setItem("defaultCohort", info.cohort)
        : console.log("no default");
      setSessionToken();
    }
  }
  //Creates a new session token on each log in
  //This token is verfied on the home page to ensure it is the correct user
  function setSessionToken() {
    //sessionStorage.setItem("sessionToken", );

    //Sets the loading state to false so button reappears
    setIsLoading(false);
    //Sets loggin to true to redirect user to home page
    //Uses in line function so session token has time to set
    //Ran into a problem where this would run before token could place which caused a null token to be sent in home
    //This fixes that bug
    setIsLoggedIn(true);
  }
  //if user is already logged in, they will be automatically navigated to the home page
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div id="login-container">
        <h1 id="login-logo">GALVANIZE</h1>
        <h2 id="login">SIGN IN</h2>
        <Form id="login">
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              ref={emailRef}
              type="text"
              placeholder="type email here"
              required
            />
            <Form.Label>Password:</Form.Label>
            <InputGroup className="pw-input-group">
              <Form.Control
                ref={passwordRef}
                type={type}
                placeholder="type password here"
                minLength={8}
                required
              />
              <InputGroup.Text>
                <span id="show-hide-psw" onClick={handleToggle}>
                  <Icon icon={icon} size={20} />
                </span>
              </InputGroup.Text>
            </InputGroup>
            {/* Checks to see if button was pressed, if it was it shows a spinner */}
            {isLoading === true ? (
              <Button type="submit" disabled value="Sign In">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Loading...</span>
              </Button>
            ) : (
              <Button type="submit" value="Sign In" onClick={(e) => signIn(e)}>
                Login
              </Button>
            )}
          </Form.Group>
        </Form>
        <p>
          Don't have an account? Click <Link to="/register">Here</Link>
        </p>
      </div>
    </>
  );
};
