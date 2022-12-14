import { Navigate, Link } from 'react-router-dom';
import { useRef } from 'react';

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
      <h2>REGISTER</h2>
      <form>
        <label>Username</label>
        <input ref={usernameRef} type="text" placeholder="type username here" required />
        <label>Password</label>
        <input ref={passwordRef} type="password" placeholder="type password here" minLength={8} required />
        <label>Confirm Password</label>
        <input ref={confirmPasswordRef} type="password" placeholder="confirm password here" minLength={8} required />
        <label>Asana API Key</label>
        <input ref={asanaApiKeyRef} type="text" placeholder="type API key here" required />
        <input type="submit" value="Register" onClick={loginHandler} />
      </form>
      <p>
        Already have an account? Click <Link to='/login'>Here</Link> to sign in.
      </p>
    </>
  );
}