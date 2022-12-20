import { WeeklyModal } from './WeeklyModal';
import { ProjectModal } from './ProjectModal';
import { AssessmentModal } from './AssessmentModal';
import { useState } from 'react';


export const Nav = (props) => {
  const { courses, setCourses } = props

  const [selectedStudents, setSelectedStudents] = useState([])

  return (
    <nav>
      <WeeklyModal courses={courses} selectedStudents={selectedStudents} setSelectedStudents={setSelectedStudents}/>
      <ProjectModal />
      <AssessmentModal />
    </nav>
  );
}