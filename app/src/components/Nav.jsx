import { WeeklyModal } from './WeeklyModal';
import { ProjectModal } from './ProjectModal';
import { AssessmentModal } from './AssessmentModal';


export const Nav = (props) => {
  const { courses, setCourses } = props
  return (
    <nav>
      <WeeklyModal courses={courses}/>
      <ProjectModal />
      <AssessmentModal />
    </nav>
  );
}