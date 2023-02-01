import "../images/galvanize-logo.svg";
import { AdminMenu } from "./AdminMenu";
import Image from "react-bootstrap/Image";
import React, { useState } from "react";
import ProfilePhoto from "./ProfilePhoto";

export const Header = (props) => {
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props;

  return (
    <header id="header">
      <h1>GALVANIZE</h1>
      <ProfilePhoto />
      <AdminMenu
        courses={courses}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
    </header>
  );
};
