import React from "react";
import Logo from "../images/galvanize-logo.svg";
import { AdminMenu } from "./AdminMenu";

export const Header = (props) => {
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props;

  return (
    <header>
      <div className="flex bg-gray-500">
        <img src={Logo} alt="Galvanize Logo" height={50} className="ml-4"/>
        <AdminMenu courses={courses} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </header>
  );
};
