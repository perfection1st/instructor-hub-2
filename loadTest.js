import http from "k6/http";
import { sleep } from "k6";

//Load Test
export const options = {
  stages: [
    { duration: "5m", target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: "10m", target: 100 }, // stay at 100 users for 10 minutes
    { duration: "5m", target: 0 }, //ramp down to 0 users
  ],
};

export default function () {
  http.get("http://localhost:3000/api/students", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNuc29sb21hckBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBhc3N3",
    },
  });
  sleep(1);
}
