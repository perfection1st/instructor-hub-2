import {StudentStats} from './StudentStats';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export const StudentList = () => {
  return(
    <div id="student-list">
      <Table id="student-list-table" striped bordered hover>
      <thead>
        <tr>
          <th>Student</th>
          <th>Performance</th>
          
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Dylan Clark</td>
          <td>
            <ButtonGroup size="lg" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
            </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Dylan Clark</td>
          <td>
            <ButtonGroup size="lg" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
            </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>Dylan Clark</td>
          <td>
            <ButtonGroup size="lg" className="lg">
              <Button className="red">10</Button>
              <Button className="yellow">50</Button>
              <Button className="green">100</Button>
            </ButtonGroup>
          </td>
        </tr>
       
      </tbody>
    </Table>
    </div>
  );
}