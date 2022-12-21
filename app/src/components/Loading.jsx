import { Placeholder } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

export const LoadingDropdown = () => {
  return(
  <div className="loading-dropdown">
    <Placeholder as={Dropdown.Item} animation="wave">
      Loading from Asana... <br />
      <Placeholder xs={12} />
    </Placeholder>
    <Placeholder as={Dropdown.Item} animation="wave">
      <Placeholder xs={12} />
    </Placeholder>
    <Placeholder as={Dropdown.Item} animation="wave">
      <Placeholder xs={12} />
    </Placeholder>
  </div>
  );
}