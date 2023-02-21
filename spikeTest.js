import http from "k6/http";
import { sleep } from "k6";

//the point of this test is to gradually push your APIs beyond its breaking point

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-arrival-rate",
      preAllocatedVUs: 500,
      timeUnit: "1s",
      stages: [
        { duration: "2m", target: 10 }, // below normal load
        { duration: "5m", target: 10 },
        { duration: "2m", target: 20 }, // normal load
        { duration: "5m", target: 20 },
        { duration: "2m", target: 30 }, // around the breaking point
        { duration: "5m", target: 30 },
        { duration: "2m", target: 40 }, // beyond the breaking point
        { duration: "5m", target: 40 },
        { duration: "10m", target: 0 }, // scale down. Recovery stage.
      ],
    },
  },
};

export default function () {
  const BASE_URL = "http://localhost:3000"; // make sure this is not production
  const responses = http.batch([
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
}
