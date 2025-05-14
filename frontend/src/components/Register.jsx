import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    photo: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validateName = (name) => {
    if (name.length > 55) {
      return 'Name cannot exceed 55 characters';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return ''; // Phone is optional, so empty is valid
    
    // Remove any non-digit characters to count only the digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
      return 'Phone number must contain exactly 10 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }

    if (name === 'email') {
      setEmailError(validateEmail(value));
    }

    if (name === 'name') {
      setNameError(validateName(value));
    }

    if (name === 'phone') {
      setPhoneError(validatePhone(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate name
    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }
    
    // Validate email
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    // Validate password
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    // Validate phone if provided
    if (formData.phone) {
      const phoneValidationError = validatePhone(formData.phone);
      if (phoneValidationError) {
        setPhoneError(phoneValidationError);
        return;
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      if (formData.photo) {
        data.append('profile_pic', formData.photo);
      }
      await axios.post('http://localhost:5000/register', data);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <div className="char-counter">{formData.name.length}/55 characters</div>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          {emailError && <div className="email-error">{emailError}</div>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          {passwordError && <div className="password-error">{passwordError}</div>}
          <div className="password-requirements">
            Password must contain at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character.
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            placeholder="Enter 10-digit phone number" 
          />
          {phoneError && <div className="phone-error">{phoneError}</div>}
          <div className="phone-requirements">
            Phone number must contain exactly 10 digits.
          </div>
        </div>
        <div className="form-group">
          <label>Photo:</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" disabled={!!passwordError || !!emailError || !!nameError || !!phoneError}>Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="link" onClick={() => navigate('/')}>Login here</span>
      </p>
    </div>
  );
};

export default Register; 