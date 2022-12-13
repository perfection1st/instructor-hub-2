import '../css/Home.css';
import {Header} from '../components/Header';
import {Nav} from '../components/Nav';
import {StudentList} from '../components/StudentList';

export const Home = () => {
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
