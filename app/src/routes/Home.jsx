import '../css/Home.css';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Nav } from '../components/Nav';
import { StudentList } from '../components/StudentList';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';

export const Home = (props) => {

  const URL = 'http://localhost:8000/api'
  const { isLoggedIn, setIsLoggedIn } = props

  const [courses, setCourses] = useState([])

  //Sends a fetch to verify users tokens
  //If tokens don't match tokens stored under the logged in user they are logged out
  //And then returned to login page
  useEffect(() => {
    //Runs after timeout to ensure token updates
    //Gets the tokens stored in session on login
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

  }, [])

  function kickUser() {
    swal('Not Authenticated')
    sessionStorage.clear()
    setIsLoggedIn(false)
  }

  //Sends a fetch to get all of a users projects/classes from asana
   useEffect(() => {
    console.log('Fetching Asana')
    //Sends a fetch to get all users info
    fetch('https://app.asana.com/api/1.0/projects', {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('asanaToken')}`
        }
    })
    .then(result => result.json())
    .then(data => {
        //Gets all courses assigned to the user in asana and gets their gid to do individual fetches for data
        data.data.map(courses => sessionStorage.setItem(courses.name, courses.gid))
        //Sets the state to pass the data down for further use
        setCourses(data.data)
    })
  }, [])


  //if user is not already logged in, they will be automatically navigated to the login page
  // if( !isLoggedIn ){
  //   return <Navigate to="/login" />
  // }

  return (
    <>
      <div id="home-container">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Nav />
        <StudentList courses={courses}/>
      </div>
    </>
  );
}
