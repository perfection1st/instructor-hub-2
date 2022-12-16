import '../css/Register.css';
import { Navigate, Link } from 'react-router-dom';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../images/galvanize-logo.svg';
import swal from 'sweetalert';
import { useState } from 'react';

const URL = 'http://localhost:8000/api'

export const Register = (props) => {

  //State to see if account was created, if it was it sends user back to login
  const [accountCreated, setAccountCreated] = useState(false)

  const { isLoggedIn, setIsLoggedIn } = props
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const asanaApiKeyRef = useRef();

  //Creates user on form submission
  function registerUser(e) {
    e.preventDefault()
    let inputUsername = usernameRef.current.value
    let asanaKey = asanaApiKeyRef.current.value
    //Verifies that the passwords match
    let inputPassword
    if(passwordRef.current.value !== confirmPasswordRef.current.value){
      swal('passwords don\'t match, please try again!');
    } else {
      inputPassword = passwordRef.current.value;
    }
    //Ensures all fields are filled out
    if(!inputUsername || !inputPassword || !asanaKey){
      swal('Please fill out all boxes')
    } else {
      //Sends users information to create account
      fetch(`${URL}/create/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: `${inputUsername}`,
          password: `${inputPassword}`,
          asana_access_token: asanaKey
        })
      })
      .then(result => result.json())
      //Checks to see the result sent from api
      //If result is false then username is already taken
      //If result is true the account was created
      .then(data => {
        if (data[0].result == 'false'){
          swal('Username Is Taken')
        } else {
          swal('Account Created, you may now log in')
          setAccountCreated(true)
        }
      })
    }
  }

  //if user is already logged in, they will be automatically navigated to the home page
  if(accountCreated){
    return <Navigate to="/login" />
  };

  return(
    <>
    <div id="register-container">

      <h1 id="register-logo">GALVANIZE</h1>
      <h2 id="register"> Register </h2>
      <Form id="form-register">
        <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control ref={usernameRef} type="text" placeholder="type username here" required />
        <Form.Label>Password</Form.Label>

        <Form.Control ref={passwordRef} type="password" placeholder="type password here" minLength={8} required />
        <Form.Label>Confirm Password</Form.Label>

        <Form.Control ref={confirmPasswordRef} type="password" placeholder="confirm password here" minLength={8} required />
        <Form.Label>Asana API Key</Form.Label>

        <Form.Control ref={asanaApiKeyRef} type="text" placeholder="type API key here" required />
        </Form.Group>
        <Button type="submit" value="Register" onClick={(e) => registerUser(e)}>Register</Button>
      </Form>
      <p>
        Already have an account? Click <Link to='/login'>Here</Link> to sign in.
      </p>
      </div>
    </>
  );
}