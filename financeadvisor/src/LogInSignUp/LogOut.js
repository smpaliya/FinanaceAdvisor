import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut = ({ setIsAuthenticated }) => {
  const APP_PREFIX = "financeApp_";
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and username from local storage
    localStorage.removeItem(`${APP_PREFIX}token`);
    localStorage.removeItem(`${APP_PREFIX}username`);
    localStorage.removeItem(`${APP_PREFIX}user_id`);
    // Update authentication state
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Log Out
    </button>
  );
};

export default LogOut;
