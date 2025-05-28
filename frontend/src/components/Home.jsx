import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        setUser(res.data);
      }
    } catch {
      setUser(null);
    }
  };

  const getFullName = () => {
    if (!user) return 'User Name';
    return `${user.first_name} ${user.last_name}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-left">
        <div className="profile-pic-wrapper">
          <img
            src={user?.profile_pic ? `http://localhost:5000${user.profile_pic}` : 'https://via.placeholder.com/200'}
            alt="Profile"
            className="profile-pic"
          />
        </div>
        <h2 className="profile-name">{getFullName()}</h2>
      </div>
      <div className="dashboard-right">
        <div className="welcome-card">
          <h1>Welcome, {getFullName()}!</h1>
          <p>Your personal dashboard for managing contacts and more.<br />
            We offer solutions adapted to today's needs.</p>
          <button className="view-more-btn" onClick={() => navigate('/view-contacts')}>View Contacts</button>
          <button className="view-more-btn" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Home; 