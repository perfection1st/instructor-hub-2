import { Navigate } from 'react-router-dom';

export const Register = (props) => {

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
      <p>Register component</p>
      <button onClick={loginHandler}>
        Register
      </button>
    </>
  );
}