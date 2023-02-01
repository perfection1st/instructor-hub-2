import { React, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const StudentAverages = (props) => {
  const {
    students,
    learnAvg,
    arraysAvg,
    objAvg,
    domApiAvg,
    ssAvg,
    sDbAvg,
    reactAvg,
    teamworkAvg,
    techAvg,
  } = props;

  let gradedLearnAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].dve !== null) {
      gradedLearnAvg.push(students[i]);
    }
  }

  let gradedTeamworkAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].loops !== null) {
      gradedTeamworkAvg.push(students[i]);
    }
  }
  console.log(gradedTeamworkAvg);

  let gradedTechAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].fun !== null) {
      gradedTechAvg.push(students[i]);
    }
  }

  let gradedArraysAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].arrays !== null) {
      gradedArraysAvg.push(students[i]);
    }
  }

  let gradedObjAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].obj !== null) {
      gradedObjAvg.push(students[i]);
    }
  }

  let gradedDomApiAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].dom_api !== null) {
      gradedDomApiAvg.push(students[i]);
    }
  }

  let gradedSsAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].ss !== null) {
      gradedSsAvg.push(students[i]);
    }
  }

  let gradedSDbAvg = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].s_db !== null) {
      gradedSDbAvg.push(students[i]);
    }
  }

  let gradedReact = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].react !== null) {
      gradedReact.push(students[i]);
    }
  }

  var data = {
    labels: [
      "DVE",
      "Loops",
      "Functions",
      "Arrays",
      "Objects",
      "DOM API",
      "Server Side",
      "Server and Database",
      "React",
    ],
    datasets: [
      {
        label: "Cohort Avg",
        data: [
          Math.floor(learnAvg / gradedLearnAvg.length),
          Math.floor(teamworkAvg / gradedTeamworkAvg.length),
          Math.floor(techAvg / gradedTechAvg.length),
          Math.floor(arraysAvg / gradedArraysAvg.length),
          Math.floor(objAvg / gradedObjAvg.length),
          Math.floor(domApiAvg / gradedDomApiAvg.length),
          Math.floor(ssAvg / gradedSsAvg.length),
          Math.floor(sDbAvg / gradedSDbAvg.length),
          Math.floor(reactAvg / gradedReact.length),
        ],
        backgroundColor: [
          "rgb(237, 119, 28, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(255, 206, 86, 0.4)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(237, 119, 28, 3)",
          "rgba(54, 162, 235, 3)",
          "rgba(255, 206, 86, 3)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  var options = {
    scales: {
      y: {
        ticks: {
          min: 10,
          max: 100,
          stepSize: 10,
        },
      },
    },
  };
  //render
  return (
    <div id="student-avg-graph">
      <Bar id="bar" data={data} height={330} options={options} />
    </div>
  );
};
