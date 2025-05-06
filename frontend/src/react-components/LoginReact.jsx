import React, { useState } from 'react';
import axios from 'axios';

function LoginReact() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
      <style jsx>{`
        .login-container {
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
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #0056b3;
        }
        .error-message {
          color: #dc3545;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f8d7da;
          border-radius: 4px;
        }
        .register-link {
          text-align: center;
          margin-top: 15px;
        }
        .register-link a {
          color: #007bff;
          text-decoration: none;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default LoginReact; 