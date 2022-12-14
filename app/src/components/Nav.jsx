import { GoPlus } from "react-icons/go";

export const Nav = () => {
  return (
    <nav>
      <button id="btn-weekly-update">Weekly Update <GoPlus /></button>
      <button id="btn-project-update">Project Update <GoPlus /></button>
      <button id="btn-assessment-update">Assessments <GoPlus /></button>
    </nav>
  );
}