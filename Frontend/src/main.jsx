import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Chat from './pages/Chat.jsx';
import Profile from './pages/Profile.jsx';
import axios from 'axios';

const MainApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Moved useState inside a component
  const [isProfileCompleted, setIsProfileCompleted] = useState(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('https://gotalk-backend.onrender.com/api/auth', { withCredentials: true }); // Make a request to your backend
        const isAuthenticated = response.data.authenticated;
        // if (response.data.authenticated) {
        //   setIsAuthenticated(true); // User is authenticated
        // } else {
        //   setIsAuthenticated(false); // User is not authenticated
        // }
        const profileCompleted = localStorage.getItem('isProfileCompleted') === 'true';
        setIsAuthenticated(isAuthenticated);
        setIsProfileCompleted(profileCompleted);
      } catch (err) {
        setIsAuthenticated(false); // Handle errors by assuming the user is not authenticated
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this effect runs only once

  // Create router with conditional routes based on authentication status
  const router = createBrowserRouter([
    { path: '/', element: isAuthenticated && isProfileCompleted ? <Chat /> : <Register /> },
    {
      path: '/login',
      element: <Login setIsAuthenticated={setIsAuthenticated} />,
    },
    {
      path: '/register',
      element: isAuthenticated ? <Navigate to="/" /> : <Register />,
    },
    {
      path: '/profile',
      element: isAuthenticated ? (!isProfileCompleted ? <Profile setIsProfileCompleted={setIsProfileCompleted} /> : <Navigate to="/" />) : (<Navigate to="/login" />)
    }
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

// Rendering the MainApp which includes routing and auth checks
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
);
