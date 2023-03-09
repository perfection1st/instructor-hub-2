import React, { useState, useEffect } from "react";
import { GenerateGroupsModal } from "./GenerateGroupsModal";
import Table from "react-bootstrap/Table";

const Groups = ({ students, currentCohort }) => {
  const URL = "http://localhost:8000/api";
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);

  // console.log(students);
  // console.log(currentCohort);
  // console.log(groups);

  const fetchGroups = () => {
    const cohort =
      sessionStorage.getItem("currentClass") || sessionStorage.getItem("defaultCohort");
    fetch(`${URL}/assigned-student-groupings/${cohort}`)
      .then((result) => result.json())
      .then((data) => {
        setGroups(data);
      });
  };

  const getGroupIds = (cohort) => {
    fetch(`${URL}/get-group-ids/cohort`)
      .then((result) => result.json())
      .then((data) => {
        setGroupIds(data);
      });
  };

  useEffect(() => {
    // async function fetchGroups(cohort) {
    //   const response = await fetch(`${URL}/assigned-student-groupings/cohort`);
    //   const result = await response.json();
    //   setGroups(result);
    // }

    fetchGroups(currentCohort);
    getGroupIds(currentCohort);
  }, []);

  return (
    <div id="groups-container">
      <div id="groups-header">
        <h2>Groups</h2>
        <GenerateGroupsModal students={students} />
      </div>
      <div>
        <div id="groups-table-container">
          <Table id="groups-table" striped bordered hover>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Group No.</th>
              </tr>
              {groups.length > 0 ? (
                groups.map((el) => (
                  <tr key={el.student_id}>
                    <td>
                      {students.find((student) => student.student_id === el.student_id)?.name}
                    </td>
                    <td>{el.group_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No groups yet</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Groups;
