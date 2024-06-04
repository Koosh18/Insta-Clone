import React, { useState, useContext } from 'react';
import './signin.css';
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';

const Signin = () => {
  const { dispatch } = useContext(userContext);
  const history = useNavigate();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const postData = (e) => {
    e.preventDefault();
    if (!email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) {
      M.toast({ html: "Invalid email", classes: 'red-toast' });
      return;
    }
    fetch("/signin", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        M.toast({ html: data.error, classes: 'red-toast' });
      } else {
      //  console.log(data);
        M.toast({ html: data.message, classes: 'green-toast' });
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.saved));
        dispatch({ type: "USER", payload: data.saved });
        history('/'); // Redirect to home page upon successful login
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div>
      <div className="card">
        <h2>Instagram</h2>
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light" type="submit" name="action" onClick={postData}>Login</button>
      </div>
    </div>
  );
}

export default Signin;
