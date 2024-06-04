import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import { userContext } from '../../App';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState({ user: {}, posts: [] });
  const [error, setError] = useState("");
  const { state, dispatch } = useContext(userContext);
  const { userid } = useParams();

  const isMyProfile = state._id === userid;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.error) {
          setError(result.error);
        } else {
          setProfile(result);
          setIsFollowing(state.following.includes(userid));
        }
      })
      .catch(err => {
        console.error(err);
        setError("An error occurred while fetching data");
      });
  }, [userid, state.following]);

  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followID: userid
      })
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers} });
        localStorage.setItem("user",JSON.stringify(data))
        setProfile(prevState => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, state._id]
          }
        }));
      })
      .catch(err => console.error(err));
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowID: userid
      })
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers} });
        localStorage.setItem("user",JSON.stringify(data))
        setIsFollowing(false);
        setProfile(prevState => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: prevState.user.followers.filter(id => id !== state._id)
          }
        }));
      })
      .catch(err => console.error(err));
  };

  const isProfileLoaded = Object.keys(profile).length !== 0 && Object.keys(profile.user).length !== 0;

  return (
    <div className="profile-container">
      {isProfileLoaded && (
        <div className="username-box">
          <img
            src= {profile.user.pic}
            alt="Profile picture"
            className="profile-picture"
          />
          <div className="profile-details">
            <h1 className="profile-username">{profile.user.name}</h1>
            <p className="profile-bio">This is my bio. It can be a bit longer to demonstrate the layout.</p>
            <div className="profile-stats">
              <p><strong>Posts:</strong> {profile.posts.length}</p>
              <p><strong>Followers:</strong> {profile.user.followers ? profile.user.followers.length : 0}</p>
              <p><strong>Following:</strong> {profile.user.following ? profile.user.following.length : 0}</p>
              {!isMyProfile && (
                isFollowing
                  ? <button onClick={unfollowUser}>Unfollow</button>
                  : <button onClick={followUser}>Follow</button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="posts-container">
        {profile.posts.map(item => (
        
          <div key={item._id} className="profile-posts">
            <img
              src={item.photo}
              alt="Post"
              className="post-image"
            />
            <div className="post-details">
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
