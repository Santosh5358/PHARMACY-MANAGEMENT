import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute will redirect users who are not logged in to the Login page
function PrivateRoute({ element }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Check for user login status (you can replace this logic with your own)

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login page if not authenticated
  }

  return element; // Render the protected route if authenticated
}

export default PrivateRoute;
