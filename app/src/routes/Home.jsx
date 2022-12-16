import '../css/Home.css';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Nav } from '../components/Nav';
import { StudentList } from '../components/StudentList';
import { useEffect } from 'react';
import swal from 'sweetalert';

export const Home = (props) => {

  const URL = 'http://localhost:8000/api'  
  const { isLoggedIn, setIsLoggedIn } = props

  //Sends a fetch to verify users tokens
  //If tokens don't match tokens stored under the logged in user they are logged out
  //And then returned to login page
  useEffect(() => {
    //Runs after timeout to ensure token updates
    //Gets the tokens stored in session on login
    setTimeout(() => {
      fetch(`${URL}/authent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: sessionStorage.getItem('username'),
            userToken: sessionStorage.getItem('userToken'),
            sessionToken: sessionStorage.getItem('sessionToken')
        })
      })
      .then(result => result.json())
      .then(data => {
        data[0].response == 'true' ? setIsLoggedIn(true) : kickUser()
      })
    }, 1000)
  }, [])

  function kickUser() {
    swal('Not Authenticated')
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  //if user is not already logged in, they will be automatically navigated to the login page
  // if( !isLoggedIn ){
  //   return <Navigate to="/login" />
  // }

  return(
    <>
      <div id="home-container">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Nav />
        <StudentList />
      </div>
    </>
  );
}
