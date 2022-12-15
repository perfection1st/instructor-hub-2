import '../css/Register.css';
import { Navigate, Link } from 'react-router-dom';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../images/galvanize-logo.svg';

export const Register = (props) => {

  const { isLoggedIn, setIsLoggedIn } = props
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const asanaApiKeyRef = useRef();

  const loginHandler = () => {
    let username = usernameRef.current.value
    let password
    if(passwordRef.current.value !== confirmPasswordRef.current.value){
      alert('passwords don\'t match, please try again!');
    } else {
      password = passwordRef.current.value;
    }
    /*
      insert function to create new user with the username and password

      the setIsLoggedIn function will have to be placed in a async function that waits on the account creation verification to come back successfully
    */
    setIsLoggedIn(true)
  }

  //if user is already logged in, they will be automatically navigated to the home page
  if(isLoggedIn){
    return <Navigate to="/" />
  };

  return(
    <>
    <div id="register-container">

      <h1 id="register-logo">GALVANIZE</h1>
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
        <Button type="submit" value="Register" onClick={loginHandler}>Register</Button>
      </Form>
      <p>
        Already have an account? Click <Link to='/login'>Here</Link> to sign in.
      </p>
      </div>
    </>
  );
}