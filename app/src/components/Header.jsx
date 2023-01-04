import '../images/galvanize-logo.svg';
import {AdminMenu} from './AdminMenu';

export const Header = (props) => {

  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props

  return(
    <header>
      <h1>GALVANIZE</h1>
      <AdminMenu courses={courses} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    </header>
  );
}