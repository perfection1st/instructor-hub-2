import { Navigate, Link } from 'react-router-dom';
import { useRef } from 'react';

export const Login = (props) => {

  const { isLoggedIn, setIsLoggedIn } = props
  const usernameRef = useRef();
  const passwordRef = useRef();

  const loginHandler = () => {
    let username = usernameRef.current.value
    let password = passwordRef.current.value
    /*
      insert function to authenticate user with the username and password

      the setIsLoggedIn function will have to be placed in a async function that waits on the authentication to come back successfully
    */
    setIsLoggedIn(true)
  }

  //if user is already logged in, they will be automatically navigated to the home page
  if(isLoggedIn){
    return <Navigate to="/" />
  };

  return(
    <>
      <h2>SIGN IN</h2>
      <form>
        <label>Username</label>
        <input ref={usernameRef} type="text" placeholder="type username here" required />
        <label>Password</label>
        <input ref={passwordRef} type="password" placeholder="type password here" minLength={8} required />
        <input type="submit" value="Sign In" onClick={loginHandler} />
      </form>
      <p>
        Don't have an account? Click <Link to='/register'>Here</Link>
      </p>
    </>
  );
}

