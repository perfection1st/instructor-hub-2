import '../css/Home.css';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Nav } from '../components/Nav';
import { StudentList } from '../components/StudentList';

export const Home = (props) => {

  const { isLoggedIn, setIsLoggedIn } = props

  //if user is not already logged in, they will be automatically navigated to the login page
  if( !isLoggedIn ){
    return <Navigate to="/login" />
  }

  return(
    <>
      <div id="home-container">
        <Header />
        <Nav />
        <StudentList />
      </div>
    </>
  );
}
