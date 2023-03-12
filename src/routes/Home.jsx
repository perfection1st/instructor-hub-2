import React from "react";
import "../css/Home.css";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import { StudentList } from "../components/StudentList";
// to use context API, i first had to imort it in line 9
import { useEffect, useState, createContext } from "react";
import swal from "sweetalert";
import { StudentAverages } from "../components/StudentAverages";
import Groups from "../components/Groups";
// then to use context api, i had to initialize and export it so it could be used in children components. 
export const CohortContext = createContext();

export const Home = (props) => {
  const URL = "http://localhost:8000/api";
  const { isLoggedIn, setIsLoggedIn } = props;

  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [currentCohort, setCurrentCohort] = useState("");

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
    let currentClass = '';
    if (sessionStorage.getItem("currentClass")) {
      setCurrentCohort(sessionStorage.getItem("currentClass"));
      currentClass = sessionStorage.getItem("currentClass");
    } else {
      setCurrentCohort(sessionStorage.getItem("defaultCohort"));
      currentClass = sessionStorage.getItem("defaultCohort");
    }
    fetch(`${URL}/students/${currentClass}`)
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

  //Sends a fetch to get all of the cohorts
  useEffect(() => {
    dbCohorts();
  }, []);

  // i made this function global using context API. 
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
    // we used Provider property of the context api, which passed down dbCohorts function to it's children. 
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
            <Groups students={students} currentCohort={currentCohort}/>
          </div>
        </div>
      </div>
    </CohortContext.Provider>
  );
};
