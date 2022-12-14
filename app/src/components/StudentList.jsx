import {StudentStats} from './StudentStats';
import {StudentAverages} from './StudentAverages';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export const StudentList = () => {
  return(
    <div id="student-list-container">
      <ul id="students">
        <li>
          <h3>Dylan Clark</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Elijah Stamp</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Katie "Chevy" Chevez</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Nathaniel "Nate" Morrison</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Timothy "Timotheus" Iott</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
        <li>
          <h3>Adam "Jones" Jones</h3>
          <ButtonGroup size="md" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
          </ButtonGroup>
        </li>
      </ul>
      <StudentAverages />
    </div>
  );
}
