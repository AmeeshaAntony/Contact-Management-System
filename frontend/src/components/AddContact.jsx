import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddContact.css';

const AddContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    user_id: localStorage.getItem('user_id')
  });
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateName = (name) => {
    if (name.length > 55) {
      return 'Name cannot exceed 55 characters';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validatePhone = (phone) => {
    // Remove any non-digit characters to count only the digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
      return 'Phone number must contain exactly 10 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate fields on change
    if (name === 'name') {
      setNameError(validateName(value));
    }
    if (name === 'email') {
      setEmailError(validateEmail(value));
    }
    if (name === 'phone') {
      setPhoneError(validatePhone(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields before submission
    const nameValidationError = validateName(formData.name);
    const emailValidationError = validateEmail(formData.email);
    const phoneValidationError = validatePhone(formData.phone);

    if (nameValidationError || emailValidationError || phoneValidationError) {
      setNameError(nameValidationError);
      setEmailError(emailValidationError);
      setPhoneError(phoneValidationError);
      return;
    }

    try {
      await axios.post('http://localhost:5000/contacts', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/contacts');
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact. Please try again.');
    }
  };

  return (
    <div className="add-contact-container">
      <h2>Add New Contact</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={55}
            required
          />
          {nameError && <div className="name-error">{nameError}</div>}
          <div className="char-counter">{formData.name.length}/55 characters maximum</div>
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
          {emailError && <div className="email-error">{emailError}</div>}
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            required
          />
          {phoneError && <div className="phone-error">{phoneError}</div>}
          <div className="phone-requirements"></div>
        </div>
        <button type="submit" disabled={!!nameError || !!emailError || !!phoneError}>Add Contact</button>
      </form>
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate('/contacts')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AddContact; 