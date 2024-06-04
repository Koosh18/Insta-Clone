import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import { userContext } from '../../App';
import M from 'materialize-css';

const Profile = () => {
  const [myPics, setMyPics] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [image, setImage] = useState('');
  const [executed, setExecuted] = useState(false); // Manage the executed flag

  // Function to update profile picture
  const updateProfilePic = (imageUrl) => {
    fetch('/updatepic', {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({ pic: imageUrl })
    })
    .then(res => res.json())
    .then(result => {
      localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
      dispatch({ type: "UPDATEPIC", payload: result.pic });
      M.toast({ html: 'Profile picture updated!', classes: 'green-toast' });
    })
    .catch(err => {
      console.error('Error updating profile picture:', err);
      M.toast({ html: 'Failed to update profile picture!', classes: 'red-toast' });
    });
  };

  useEffect(() => {
    fetch('/mypost', {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('jwt')
      }
    })
    .then(res => res.json())
    .then(result => {
      setMyPics(result.posts);
    });
  }, []);

  useEffect(() => {
    if (image && !executed) { // Check if there's a new image and the effect hasn't executed yet
      setExecuted(true); // Mark the effect as executed
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta_clone");
      data.append("cloud_name", "dqwjjy76b");
  
      fetch("https://api.cloudinary.com/v1_1/dqwjjy76b/image/upload", {
        method: "post",
        body: data
      })
      .then(res => res.json())
      .then((data) => {
        console.log('Image uploaded successfully:', data.url);
        setImage(data.url);
        // Call function to update profile picture
        updateProfilePic(data.url);
      })
      .catch((error) => {
        console.error('Error uploading image to Cloudinary:', error);
        M.toast({ html: "Image upload failed!", classes: 'red-toast' });
      });
    }
  }, [image, executed]); // Include 'image' and 'executed' in the dependency array

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  }

  return (
    <div className="profile-container">
      <div className="username-box">
        <img
          src={state ? state.pic : "load"}
          alt="Profile picture"
          className="profile-picture"
        />
        <div className="profile-details">
          <h1 className="profile-username">{state ? state.name : "Loading"}</h1>
          <div className="file-upload-button">
            <span>Choose Profile Pic</span>
            <input
              type="file"
              className="file-upload-input"
              onChange={handleFileChange}
            />
          </div>
          <p className="profile-bio">This is my bio. It can be a bit longer to demonstrate the layout.</p>
          <div className="profile-stats">
            <p><strong>Posts:</strong> {myPics.length}</p>
            <p><strong>Followers:</strong> {state.followers ? state.followers.length : 0}</p>
            <p><strong>Following:</strong> {state.following ? state.following.length : 0}</p>
          </div>
        </div>
      </div>
      <div className="posts-container">
        {myPics.map(item => (
          <div key={item._id} className="profile-posts">
            <img
              src={item.photo}
              alt="Post"
              className="post-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
