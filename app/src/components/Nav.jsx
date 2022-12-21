import { WeeklyModal } from './WeeklyModal';
import { ProjectModal } from './ProjectModal';
import { AssessmentModal } from './AssessmentModal';
import { CreateCohortModal } from './CreateCohortModal';


export const Nav = (props) => {
  const { courses, setCourses } = props
  return (
    <nav>
      <WeeklyModal courses={courses}/>
      <ProjectModal />
      <AssessmentModal />
      <CreateCohortModal />
    </nav>
  );
}