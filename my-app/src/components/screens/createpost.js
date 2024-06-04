import React, { useState, useEffect } from 'react';
import './createpost.css';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';

const Createpost = () => {
  const history = useNavigate();
  const [Title, setTitle] = useState("");
  const [Body, setBody] = useState("");
  const [Image, setImage] = useState("");
  const [url, setUrl] = useState("");
var num = 0 ; 
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title: Title,
          body: Body,
          pic: url
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: 'red-toast' });
        } else {
          M.toast({ html: "Post created successfully!", classes: 'green-toast' });
          history('/');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [url, Title, Body, history]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", Image);
    data.append("upload_preset", "insta_clone");
    data.append("cloud-name", "dqwjjy76b");
    fetch("https://api.cloudinary.com/v1_1/dqwjjy76b/image/upload", {
      method: "post",
      body: data
    })
    .then(res => res.json())
    .then((data) => {
      setUrl(data.url);
    })
    .catch((error) => {
      console.error('Error:', error);
      M.toast({ html: "Image upload failed!", classes: 'red-toast' });
    });
  }

  return (
    <div className='card-input-filled'>
      <input type='text' placeholder='Title' value={Title} onChange={(e) => setTitle(e.target.value)} className="input-field"/>
      <input type='text' placeholder='Body' value={Body} onChange={(e) => setBody(e.target.value)} className="textarea-field"/>
      <div className='file-field'>
        <div className='btn file-upload-button'>
          <span>Upload Image</span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} className="file-upload-input"/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path" type='text' placeholder="No file chosen"/>
        </div>
      </div>
      <button className='btn waves-effect waves-light' onClick={postDetails}>SUBMIT</button>
    </div>
  );
}

export default Createpost;
