import "../images/galvanize-logo.svg";
import { AdminMenu } from "./AdminMenu";
import Image from "react-bootstrap/Image";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
export const Header = (props) => {
  const { courses, isLoadingCourses, isLoggedIn, setIsLoggedIn } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const URL = "http://localhost:8000";

  let user = sessionStorage.getItem("username");

  function handleFileChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageDataUrl(reader.result);
      console.log(file);
    };

    reader.readAsDataURL(file);
  }

  function handleUpload() {
    // Use fetch or axios to send the image data URL to your server
    fetch(`${URL}/api/profile-image`, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img: imageDataUrl,
        user: sessionStorage.getItem("username"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        console.log(user);
      });
  }

  return (
    <header id="header">
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <input type="file" onChange={handleFileChange} />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>GALVANIZE</h1>
      <Image
        onClick={handleShow}
        src="https://img.myloview.com/stickers/default-avatar-profile-icon-vector-unknown-social-media-user-photo-700-209987478.jpg"
        id="profile-pic"
      ></Image>
      <AdminMenu
        courses={courses}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
    </header>
  );
};
