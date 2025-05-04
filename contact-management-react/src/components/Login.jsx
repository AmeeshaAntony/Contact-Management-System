// src/components/Login.jsx
import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      console.log(res.data);  // Check what backend sends
  
      if (res.data.message === 'Login successful' && res.data.user_id) {
        localStorage.setItem('user_id', res.data.user_id);  // ✅ Store user_id
        setMessage('Login successful!');
      } else {
        setMessage('Login failed: Invalid credentials');
      }
    } catch (err) {
      setMessage('Login failed');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  )
}

export default Login
