import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Input
} from '@mui/material';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    date_of_birth: '',
    photo: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
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
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) ? '' : 'Please enter a valid email address';
  };

  const validateName = (firstName, lastName) => {
    if (!firstName) {
      return 'First name is required';
    }
    if (!lastName) {
      return 'Last name is required';
    }
    if (firstName.length > 50) {
      return 'First name must be less than 50 characters';
    }
    if (lastName.length > 50) {
      return 'Last name must be less than 50 characters';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) {
      return 'Phone number is required';
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return 'Phone number must contain exactly 10 digits';
    }
    return '';
  };

  const validateDateOfBirth = (date) => {
    if (!date) {
      return 'Date of birth is required';
    }
    return '';
  };

  const validatePhoto = (photo) => {
    if (!photo) {
      return 'Profile photo is required';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (name === 'first_name' || name === 'last_name') {
      const currentName = name === 'first_name' ? value : formData.first_name;
      const otherName = name === 'last_name' ? value : formData.last_name;
      
      if (name === 'first_name' && value.length > 50) {
        setNameError('First name must be less than 50 characters');
      } else if (name === 'last_name' && value.length > 50) {
        setNameError('Last name must be less than 50 characters');
      } else {
        setNameError(validateName(currentName, otherName));
      }
    }

    if (name === 'password') {
      setPasswordError(validatePassword(value));
      // Check password match when password changes
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }

    if (name === 'confirmPassword') {
      // Check password match when confirm password changes
      if (value && value !== formData.password) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
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
    setSuccess('');
    
    // Validate all fields
    const nameValidationError = validateName(formData.first_name, formData.last_name);
    const emailValidationError = validateEmail(formData.email);
    const passwordValidationError = validatePassword(formData.password);
    const phoneValidationError = validatePhone(formData.phone);
    const dateValidationError = validateDateOfBirth(formData.date_of_birth);
    const photoValidationError = validatePhoto(formData.photo);

    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }
    
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    if (dateValidationError) {
      setError(dateValidationError);
      return;
    }

    if (photoValidationError) {
      setError(photoValidationError);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('phone', formData.phone);
      data.append('date_of_birth', formData.date_of_birth);
      if (formData.photo) {
        data.append('profile_pic', formData.photo);
      }
      const response = await axios.post('http://localhost:5000/register', data);
      if (response.data.message) {
        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="first_name"
              label="First Name"
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!nameError}
              helperText={nameError}
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="last_name"
              label="Last Name"
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!nameError}
              helperText={nameError}
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!phoneError}
              helperText={phoneError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              id="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                name="photo"
                onChange={handleChange}
                required
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  Upload Photo
                </Button>
              </label>
              {previewUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 