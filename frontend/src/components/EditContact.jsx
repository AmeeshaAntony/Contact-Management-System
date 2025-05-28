import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditContact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    profile_pic: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setFormData(response.data);
          if (response.data.profile_pic) {
            setPreviewUrl(`http://localhost:5000${response.data.profile_pic}`);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_pic') {
      setFormData(prev => ({
        ...prev,
        profile_pic: files[0]
      }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setError('User ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token is missing');
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.put(`http://localhost:5000/user/${userId}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && !localStorage.getItem('user_id')) {
    return (
      <div className="edit-contact-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/edit-profile')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="edit-contact-container">
      <h2>Edit Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-pic-wrapper">
        <img
          src={previewUrl || '/default-profile.png'}
          alt="Profile"
          className="profile-pic"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-profile.png';
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth:</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile_pic">Profile Photo:</label>
          <input
            type="file"
            id="profile_pic"
            name="profile_pic"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/edit-profile')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditContact; 