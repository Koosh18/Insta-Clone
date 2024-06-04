import React, { useReducer, createContext, useEffect, useState } from 'react';
import Navbar from './components/navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/screens/signin';
import Signup from './components/screens/signup';
import Home from './components/screens/home';
import Profile from './components/screens/profile';
import Createpost from './components/screens/createpost';
import { reducer, initialstate } from './reducers/userreducer';
import UserProfile from './components/screens/Userprofile';

export const userContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialstate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({ type: "USER", payload: parsedUser });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    setLoading(false); // Set loading to false after checking localStorage
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: A loading indicator
  }

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
        
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        
          <Route
            path="/profile"
            element={
              state ? (
                <Profile />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/"
            element={
              state ? (
                <Home/>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/createpost"
            element={
              state ? (
                <Createpost />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
           <Route
            path="/profile/:userid"
            element={
              state ? (
                <UserProfile />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
};

export default App;
