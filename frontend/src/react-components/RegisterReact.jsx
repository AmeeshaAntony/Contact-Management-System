import React, { useState } from 'react';
import axios from 'axios';

function RegisterReact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Login here</a>
      </p>
      <style jsx>{`
        .register-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          width: 100%;
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #218838;
        }
        .error-message {
          color: #dc3545;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8d7da;
          border-radius: 4px;
        }
        .login-link {
          text-align: center;
          margin-top: 15px;
        }
        .login-link a {
          color: #007bff;
          text-decoration: none;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default RegisterReact; 