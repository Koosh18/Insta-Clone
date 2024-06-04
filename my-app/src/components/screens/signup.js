import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (url) {
      // Only post data after the image has been uploaded
      submitSignupForm();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta_clone');
    data.append('cloud_name', 'dqwjjy76b');
    fetch('https://api.cloudinary.com/v1_1/dqwjjy76b/image/upload', {
      method: 'post',
      body: data
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url);
    })
    .catch(error => {
      console.error('Error:', error);
      M.toast({ html: 'Image upload failed!', classes: 'red-toast' });
    });
  };

  const submitSignupForm = () => {
    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url // Include the profile picture URL
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        M.toast({ html: data.error, classes: 'red-toast' });
      } else {
        M.toast({ html: data.message, classes: 'green-toast' });
        history('/signin');
      }
    })
    .catch(err => {
      console.error(err);
      M.toast({ html: 'Signup failed!', classes: 'red-toast' });
    });
  };

  const postData = (e) => {
    e.preventDefault();
    if (!email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) {
      M.toast({ html: 'Invalid email', classes: 'red-toast' });
      return;
    }
    if (image) {
      uploadPic();
    } else {
      submitSignupForm();
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='btn file-upload-button'>
          <span>Upload Profile Pic </span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} className="file-upload-input"/>
        </div>
        <button
          className="btn waves-effect waves-light"
          type="submit"
          name="action"
          onClick={postData}
        >
          Sign Up
          <i className="material-icons right"></i>
        </button>
      </div>
    </div>
  );
};

export default Signup;
