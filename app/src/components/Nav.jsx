import { WeeklyModal } from './WeeklyModal';
import { ProjectModal } from './ProjectModal';
import { AssessmentModal } from './AssessmentModal';

export const Nav = () => {
  return (
    <nav>
      <WeeklyModal />
      <ProjectModal />
      <AssessmentModal />
    </nav>
  );
}