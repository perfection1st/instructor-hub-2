import '../images/galvanize-logo.svg';
import {AdminMenu} from './AdminMenu';

export const Header = (props) => {

  const { isLoggedIn, setIsLoggedIn } = props

  return(
    <header>
      <h1>GALVANIZE</h1>
      <AdminMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    </header>
  );
}