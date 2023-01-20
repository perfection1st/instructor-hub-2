import "../css/Register.css";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, Link } from "react-router-dom";
import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../images/galvanize-logo.svg";
import swal from "sweetalert";
import { useState } from "react";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import InputGroup from "react-bootstrap/InputGroup";

const URL = "http://localhost:8000/api";

export const Register = () => {
  //State to see if account was created, if it was it sends user back to login
  const [accountCreated, setAccountCreated] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  //useState for shoe/hide password
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  // if statement for password icon toggle
  const handleToggle = () => {
    if (type == "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  // Loading spinner
  const [isLoading, setIsLoading] = useState(false);

  //Creates user on form submission
  function registerUser(e) {
    e.preventDefault();
    setIsLoading(true);
    let inputEmail = emailRef.current.value;
    //Verifies that the passwords match
    let inputPassword;
    //Checks to make sure the passwords match
    //If they don't it exits the function
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return swal("Passwords don't match, please try again!");
    } else {
      inputPassword = passwordRef.current.value;
    }
    //Ensures all fields are filled out
    if (inputPassword.length < 8 || inputPassword.length > 12) {
      swal("Password must be between 8 - 12 characters");
      setIsLoading(false);
    } else if (!inputEmail || !inputPassword) {
      swal("Please fill out all boxes");
      setIsLoading(false);
    } else {
      //Sends users information to create account
      fetch(`${URL}/register`, {
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
        //Checks to see the result sent from api
        //If result is false then username is already taken
        //If result is true the account was created
        .then((data) => {
          if (data.response == "Email already exists") {
            swal("Email Is Taken");
          } else {
            swal("Account Created, you may now log in");
            setAccountCreated(true);
            setIsLoading(false);
          }
        });
    }
  }

  //if user is already logged in, they will be automatically navigated to the home page
  if (accountCreated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div id="register-container">
        <h1 id="register-logo">GALVANIZE</h1>
        <h2 id="register"> Register </h2>
        <Form id="form-register">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              ref={emailRef}
              type={"text"}
              placeholder="type email here"
              required
            />
            <Form.Label>Password</Form.Label>
            <InputGroup className="pw-input-group">
              <Form.Control
                ref={passwordRef}
                type={type}
                placeholder="type password here"
                minLength={8}
                required
              />
              <InputGroup.Text>
                <span
                  className="show-hide-psw"
                  title="Show/Hide Password"
                  onClick={handleToggle}
                >
                  <Icon icon={icon} size={22} />
                </span>
              </InputGroup.Text>
            </InputGroup>

            <Form.Label id="password-icon">Confirm Password</Form.Label>
            <Form.Control
              ref={confirmPasswordRef}
              type={type}
              placeholder="confirm password here"
              minLength={8}
              required
            />
          </Form.Group>
          {isLoading === true ? (
            <Button type="submit" value="Register">
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
            <Button
              type="submit"
              value="Register"
              onClick={(e) => registerUser(e)}
            >
              Register
            </Button>
          )}
        </Form>
        <p>
          Already have an account? Click <Link to="/login">Here</Link> to sign
          in.
        </p>
      </div>
    </>
  );
};
