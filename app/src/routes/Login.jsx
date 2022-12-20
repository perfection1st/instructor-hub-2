import '../css/Login.css';
import { Navigate, Link} from 'react-router-dom';
import { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import Spinner from 'react-bootstrap/Spinner'
import { useState } from 'react';
import '../images/galvanize-logo.svg';


export const Login = (props) => {

  const URL = 'http://localhost:8000/api'

  const { isLoggedIn, setIsLoggedIn } = props
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  //Does not take user to home page yet
  //Does a fetch call on log in click that sends the users password and username to authent
  function signIn(e) {
    e.preventDefault()
    setIsLoading(true)
    //Gives the loading state time to load
    setTimeout(() => {
      loginHandler()
    }, 1000)
  }
  const loginHandler = () => {
    let inputUsername = usernameRef.current.value
    let inputPassword = passwordRef.current.value
    //Checks to ensure both a username and password were input
   if(!inputUsername || !inputPassword){
    swal('Both username and Paswword are required')
    setIsLoading(false)
   } else {
   //Sends a request to the login to verify username and password
    fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: `${inputUsername}`,
        password: `${inputPassword}`
      })
    })
    .then(result => result.json())
    .then(data => verifyLogin(data))
   }
  }
  //Verifies that the user was logged in
  //If the response is not the users information it gives an alert
  //If login was successful it sets session storage to users info
  function verifyLogin(data){
    let info = data[0]
    if(info.response == 'Incorrect Username'){
      swal('Incorrect Username')
      setIsLoading(false)
    } else if(info.response == 'false'){
      swal('Incorrect Password')
      setIsLoading(false)
    } else {
      sessionStorage.setItem('username', info.username)
      sessionStorage.setItem('userToken', info.userToken)
      sessionStorage.setItem('asanaToken', info.asanaToken)
      setSessionToken()
    }
  }
  //Creates a new session token on each log in
  //This token is verfied on the home page to ensure it is the correct user
  function setSessionToken(){
    fetch(`${URL}/token`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: sessionStorage.getItem('username')
      })
    })
    .then(result => result.json())
    .then(data => {
      sessionStorage.setItem('sessionToken', data[0].session_token)
    })
    //Sets the loading state to false so button reappears
    .then(setIsLoading(false))
    //Sets loggin to true to redirect user to home page
    //Uses in line function so session token has time to set
    //Ran into a problem where this would run before token could place which caused a null token to be sent in home
    //This fixes that bug
    .then(() => setIsLoggedIn(true))
  }
  //if user is already logged in, they will be automatically navigated to the home page
  if(isLoggedIn){
    return <Navigate to="/" />
  };

  return(
    <>
    <div id="login-container">
    <h1 id="login-logo">GALVANIZE</h1>
      <h2 id="login">SIGN IN</h2>
      <Form id="login">
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control ref={usernameRef} type="text" placeholder="type username here" required />
            <Form.Label>Password:</Form.Label>
            <Form.Control ref={passwordRef} type="password" placeholder="type password here" minLength={8} required />
            {/* Checks to see if button was pressed, if it was it shows a spinner */}
            { isLoading === true ?
              <Button type='submit' disabled value="Sign In">
              <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span></Button>

              :
              <Button type='submit' value="Sign In" onClick={(e) => signIn(e)} >Login</Button>
          }
          </Form.Group>
        </Form>
        <p>
          Don't have an account? Click <Link to='/register'>Here</Link>
        </p>
      </div>
    
    </>
  );
}

