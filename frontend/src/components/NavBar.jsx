import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/contacts')}>
        Contact Manager
      </div>
      <div className="nav-links">
        <span className="nav-link" onClick={() => navigate('/add-contact')}>Add Contacts</span>
        <span className="nav-link edit-profile-link" onClick={() => navigate('/edit-profile')}>Edit Profile</span>
        <span className="nav-link logout-link" onClick={handleLogout}>Logout</span>
      </div>
    </nav>
  );
};

export default NavBar; 