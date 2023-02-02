import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 10,
  duration: '30s',
};
export default function () {
  http.get('http://localhost:8000/image/f84dd5fb0bda1ba2d636c0bfdc795115');
  sleep(1);
}