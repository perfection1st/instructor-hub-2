import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";

export const ModalList = (props) => {
  //Passes down selectedStudents state for checkbox functionality
  const { selectedStudents, setSelectedStudents } = props;

  //Makes a fetch to the users Asana to get student info based on selected course
  const [studentsState, setStudentsState] = useState([]);
  let currentClass = sessionStorage.getItem("currentClass");
  let gid = sessionStorage.getItem(currentClass);
  useEffect(() => {
    fetch(`http://localhost:8000/api/students/${currentClass}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setStudentsState(data);
      });
  }, []);
  function clickStudent(e) {
    //Checks to see if box was unclicked
    //Removes student from state used to add changes if so
    if (!e.target.checked) {
      let findKey = e.target.id;
      //Filters the selected students to remove the unchecked student
      let deleteObj = selectedStudents.filter((obj) => {
        return obj.student_id !== findKey;
      });
      setSelectedStudents(deleteObj);
    } else {
      //Checks to see if there is already anything in the state
      //If not it only puts the obj in without spread operator
      if (selectedStudents === []) {
        let obj = {
          student_id: e.target.id,
          name: e.target.value,
          techAptitude: 4,
          teamAptitude: 4,
          learnGrade: 100,
          projectGrade: "Pass",
        };
        setSelectedStudents(obj);
      } else {
        let obj = {
          student_id: e.target.id,
          name: e.target.value,
          techAptitude: 4,
          teamAptitude: 4,
          learnGrade: 100,
          projectGrade: "Pass",
        };
        setSelectedStudents([...selectedStudents, obj]);
      }
    }
  }
  return (
    <>
      {/* Checks to see if the students are present in selectedStudent state
            if they are it keeps the check in the box even if modal is closed */}
      <ul id="project-student-list">
        {studentsState
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((student) => {
            return selectedStudents.find(
              (selected) => selected.student_id === student.student_id
            ) ? (
              <li key={student.student_id}>
                <input
                  type="checkbox"
                  value={student.name}
                  onChange={(e) => clickStudent(e)}
                  id={student.student_id}
                />
                {student.name}
              </li>
            ) : (
              <li key={student.student_id}>
                <input
                  type="checkbox"
                  value={student.name}
                  onChange={(e) => clickStudent(e)}
                  id={student.student_id}
                />
                {student.name}
              </li>
            );
          })}
      </ul>
    </>
  );
};
