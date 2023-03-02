import React from "react";
import { GenerateGroupsModal } from "./GenerateGroupsModal";

const Groups = ({ students }) => {
  return (
    <div id="groups-container">
      <div id="groups-header">
        <h2>Groups</h2>
        <GenerateGroupsModal students={students} />
      </div>
    </div>
  );
};

export default Groups;
