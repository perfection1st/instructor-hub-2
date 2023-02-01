import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Image from "react-bootstrap/Image";

export default function ProfilePhoto() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [profile, setProfile] = useState();

  const URL = "http://localhost:8000";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  async function postImage({ image }) {
    // Create form data
    const formData = new FormData();
    formData.append("image", file);
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const result = await axios.post(`${URL}/image`, formData, config);
    return result.data;
  }
  const handleUpload = async (event) => {
    event.preventDefault();
    const result = await postImage({ image: file });
    setImages([result.imagePath]);
    console.log(result.imagePath);
    axios.patch(
      `${URL}/update/img`,
      { username: sessionStorage.getItem("username"), img: result.imagePath },
      { headers: { "Content-Type": "application/json" } }
    );
    setShow(false);
  };
  useEffect(() => {
    fetch(`${URL}/images/${sessionStorage.getItem("username")}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data[0].img);
        console.log(profile);
      });
  });
  return (
    <div>
      <Image
        onClick={() => setShow(true)}
        src={`${URL}${profile}`}
        id="profile-pic"
      ></Image>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
