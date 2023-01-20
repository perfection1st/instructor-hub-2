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
  const { students, learnAvg, teamworkAvg, techAvg } = props;

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
          Math.floor(learnAvg / students.length),
          Math.floor(teamworkAvg / students.length),
          Math.floor(techAvg / students.length),
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
