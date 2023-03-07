import React from "react";
import "../css/Home.css";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import { StudentList } from "../components/StudentList";
import { useEffect, useState, createContext } from "react";
import swal from "sweetalert";
import { StudentAverages } from "../components/StudentAverages";
import Groups from "../components/Groups";
export const CohortContext = createContext();

export const Home = (props) => {
  const URL = "http://localhost:8000/api";
  const { isLoggedIn, setIsLoggedIn } = props;

  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // State needed for the Graph Component
  const [students, setStudents] = useState([]);
  const [learnAvg, setLearnAvg] = useState(0);
  const [teamworkAvg, setTeamworkAvg] = useState(0);
  const [techAvg, setTechAvg] = useState(0);

  // Fetch the students
  // function fetchStudents() {
  //   fetch(`/api/students/:cohort`)
  //     .then((result) => result.json())
  //     .then((data) => setStudents(data));
  // }

  // Fetch the scores of all students within the cohort and set the average Learn, Teamwork, and Tech grades
  useEffect(() => {
    if (sessionStorage.getItem("currentClass")) {
      console.log("currentClass is here")
    } else {
      console.log(sessionStorage.getItem("defaultCohort"))
    }
    let currentClass = sessionStorage.getItem("currentClass");
    fetch(`http://localhost:8000/api/students/${currentClass}`)
      .then((result) => result.json())
      .then((data) => {
        setStudents(data);
      })
      .then(() => {
        setLearnAvg(
          students.map((student) => student.learn_avg).reduce((acc, score) => acc + score, 0)
        );
        setTeamworkAvg(
          students.map((student) => student.teamwork_avg).reduce((acc, score) => acc + score, 0)
        );
        setTechAvg(
          students.map((student) => student.tech_avg).reduce((acc, score) => acc + score, 0)
        );
      });
  }, [courses]);

  //Sends a fetch to verify users tokens
  //If tokens don't match tokens stored under the logged in user they are logged out
  //And then returned to login page
  useEffect(() => {
    //Runs after timeout to ensure token updates
    //Gets the tokens stored in session on login
    fetch(`${URL}/authent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: sessionStorage.getItem('username'),
        userToken: sessionStorage.getItem('userToken'),
        sessionToken: sessionStorage.getItem('sessionToken')
      })
    })
      .then(result => result.json())
      .then(data => {
        data[0]?.response == 'true' ? 
        setIsLoggedIn(true) : 
        setIsLoggedIn(false)
      })

  }, [])

  // kickUser()

  // function kickUser() {
  //   swal('Not Authenticated')
  //   sessionStorage.clear()
  //   setIsLoggedIn(false)
  // }

  //Sends a fetch to get all of a users projects/classes from asana
  useEffect(() => {
    dbCohorts();
    // fetchStudents();
    //Was used when connected to asana, no longer used
    //Sends a fetch to get all users info
    // fetch('https://app.asana.com/api/1.0/projects', {
    //     headers: {
    //         Authorization: `Bearer ${sessionStorage.getItem('asanaToken')}`
    //     }
    // })
    // .then(result => result.json())
    // .then(data => {
    //     //Gets all courses assigned to the user in asana and gets their gid to do individual fetches for data
    //     data.data.map(courses => sessionStorage.setItem(courses.name, courses.gid))
    //     //Sets the state to pass the data down for further use
    //     setCourses(data.data)
    //     setIsLoadingCourses(false);
    //     dbCohorts()
    // })
  }, []);

  function dbCohorts() {
    fetch(`${URL}/cohorts`)
      .then((result) => result.json())
      .then((data) => {
        setCourses(data);
      })
      .then(setIsLoadingCourses(false));
  }

  //if user is not already logged in, they will be automatically navigated to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <CohortContext.Provider value={{ dbCohorts }}>
      <div id="page-container">
        <div id="header-container">
          <Header
            courses={courses}
            isLoadingCourses={isLoadingCourses}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          <Nav />

        </div>
        <div id="home-container">
          <StudentList
            courses={courses}
            isLoadingCourses={isLoadingCourses}
            setIsLoadingCourses={setIsLoadingCourses}
            data-testid="student-list"
          />
          <div id="graph-groups-container">
            <StudentAverages
              students={students}
              learnAvg={learnAvg}
              teamworkAvg={teamworkAvg}
              techAvg={techAvg}
            />
            <Groups students={students} />
          </div>
        </div>
      </div>
    </CohortContext.Provider>
  );
};
