import React, { useState, useEffect } from 'react';
import './home.css'; // Import CSS file for styles
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/folpost', {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then(result => {
      console.log("Fetched posts:", result.posts); // Log fetched data
      setData(result.posts);
    })
    .catch(err => {
      console.error("Error fetching posts:", err);
    });
  };

  const likePost = (id) => {
    fetch('/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({ postId: id })
    })
    .then(res => res.json())
    .then(result => {
      console.log("Liked post:", result); // Log updated post
      const newData = data.map(item => item._id === result._id ? result : item);
      setData(newData);
    });
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({ postId: id })
    })
    .then(res => res.json())
    .then(result => {
      console.log("Unliked post:", result); // Log updated post
      const newData = data.map(item => item._id === result._id ? result : item);
      setData(newData);
    });
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({ postId, text })
    })
    .then(res => res.json())
    .then(result => {
      console.log("Commented on post:", result); // Log updated post with comment
      const newData = data.map(item => item._id === result._id ? result : item);
      setData(newData);
    });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: 'delete',
      headers: {
        Authorization: "Bearer " + localStorage.getItem('jwt')
      }
    })
    .then(res => res.json())
    .then(result => {
      console.log("Deleted post:", result); // Log deleted post response
      const newData = data.filter(item => item._id !== postId);
      setData(newData);
    })
    .catch(err => {
      console.error("Error deleting post:", err);
    });
  };

  return (
    <div className='Home'>
      {data.map(item => (
        <div className='home-container' key={item._id}>
          <div className='home-card'>
            <div className="card-header">
             

              <img src={item.postedBy.pic} alt="profile-pic" className="profile-pic" />
              <h3 className="profile-name">
                <Link to={"/profile/" + item.postedBy._id}>{item.postedBy.name}</Link>
              </h3>
            </div>
            <div className='card-image'>
              <img src={item.photo} alt={item.title} />
            </div>
            <div className='card-content'>
              <h5>{item.title}</h5>
              <p>{item.body}</p>
              <i className="material-icons" style={{ color: "Red" }}>favorite</i>
              <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
              <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
              <i className="material-icons" onClick={() => deletePost(item._id)}>delete</i>
              <h6>{item.likes.length} likes</h6>
              {item.comments.map(record => (
                <h6 key={record._id}>
                  <strong>{record.postedBy.name}</strong> {record.text}
                </h6>
              ))}
              <form onSubmit={(e) => {
                e.preventDefault();
                makeComment(e.target[0].value, item._id);
                e.target[0].value = "";
              }}>
                <input type='text' placeholder='Add a comment' />
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;