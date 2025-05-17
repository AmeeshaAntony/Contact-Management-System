import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    user_id: localStorage.getItem('user_id')
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/contacts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      
      if (response.data.user_id !== parseInt(localStorage.getItem('user_id'))) {
        setError('You do not have permission to edit this contact');
        return;
      }

      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        user_id: response.data.user_id
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      if (error.response?.status === 404) {
        setError('Contact not found');
      } else if (error.response?.status === 401) {
        setError('Please log in to edit contacts');
        navigate('/');
      } else {
        setError('Failed to fetch contact details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await axios.put(`http://localhost:5000/contacts/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      if (error.response?.status === 401) {
        setError('Please log in to edit contacts');
        navigate('/');
      } else {
        setError('Failed to update contact. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading contact details...</div>;
  }

  return (
    <div className="edit-contact-container">
      <h2>Edit Contact</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/contacts')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditContact; 