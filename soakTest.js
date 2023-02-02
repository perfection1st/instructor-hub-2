import http from "k6/http";
import { sleep } from "k6";

//Soak testing helps you uncover bugs and reliability issues that surface over an extended period. Many complex systems have bugs of this nature.
//can help find memory leaks
//pretty sure there is a memory leak in the studentList.jsx file

export const options = {
  stages: [
    { duration: "2m", target: 400 }, // ramp up to 400 users
    { duration: "3h56m", target: 400 }, // stay at 400 for ~4 hours
    { duration: "2m", target: 0 }, // scale down. (optional)
  ],
};

const BASE_URL = "http://localhost:3000";

export default function () {
  http.batch([
    [
      "GET",
      `${BASE_URL}/api/students`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNuc29sb21hckBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBhc3N3",
        },
      },
    ],
    [
      "GET",
      `${BASE_URL}/api/learn-grades`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNuc29sb21hckBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBhc3N3",
        },
      },
    ],
  ]);

  sleep(1);
}
