import { Navigate, Link } from 'react-router-dom'

export const Login = (props) => {

  const { isLoggedIn, setIsLoggedIn } = props

  const loginHandler = () => {
    setIsLoggedIn(true)
  }

  //if user is already logged in, they will be automatically navigated to the home page
  if(isLoggedIn){
    return <Navigate to="/" />
  };

  return(
    <>
      <p>This is login component</p>
      <button onClick={loginHandler}>Login</button>
      <Link to='/register'>
        <button>Create Account</button>
      </Link>
    </>
  );
}

