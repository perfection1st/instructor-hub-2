import { WeeklyModal } from './WeeklyModal';
import { ProjectModal } from './ProjectModal';
import { AssessmentModal } from './AssessmentModal';
import { useState } from 'react';


export const Nav = (props) => {
  const { courses, setCourses } = props

  const [selectedStudents, setSelectedStudents] = useState([])
  const [checked, setChecked] = useState(false)


  return (
    <nav>
      <WeeklyModal checked={checked} setChecked={setChecked} courses={courses} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents}/>
      <ProjectModal />
      <AssessmentModal courses={courses} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents}/>
    </nav>
  );
}