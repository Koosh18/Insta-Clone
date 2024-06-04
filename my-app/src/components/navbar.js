import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import { useEffect } from 'react';
import M from 'materialize-css';
import { useState } from 'react';


const Navbar = () => {

  const searchmodel = useRef(null)
  const { state, dispatch } = useContext(userContext);
  const navigate = useNavigate();
  const [search,setsearch] = useState("")
  const [userData, setuserData] = useState([])

  useEffect(()=>{
M.Modal.init(searchmodel.current)
  },[])
  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigate('/signin'); // Redirect to Signin after logout
  };

  const renderList = () => {
    if (state) { // Check if user is logged in using state truthiness
      return (
        <>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li> 
          <i data-target="modal1" className="material-icons modal-trigger">search</i>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li>
          <li>
            <button className="btn waves-effect waves-light" type="submit" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to="/signin">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </>
      );
    }
  };

  const fetchUsers = (query) => {
    setsearch(query);
    fetch('/search-users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(result => {
      console.log(result);
      setuserData(result.user)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
    
  

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <a href="/" className="brand-logo">
          Insta Clone Sasta
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchmodel} >
    <div className="modal-content"  style={{color:"black"}}>
    <input
    type='text' placeholder='search users' value={search} onChange={(e)=>fetchUsers(e.target.value)} />
      <div className="collection">
     {userData.map(item=>{
     
     return  <Link to={"/profile/"+item._id}> <li> <a href="#!" className="collection-item" onClick={()=>{
      M.Modal.getInstance(searchmodel.current).close()
     }}> {item.email}  </a></li> </Link>  
     })}
    
       
        
      </div>
    </div>
            
    <div className="modal-footer">
      <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setsearch("")}>Close </a>
    </div>
  </div>
    </nav>
  );
};

export default Navbar;
