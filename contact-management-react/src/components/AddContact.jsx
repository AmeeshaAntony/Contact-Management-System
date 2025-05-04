// src/components/AddContact.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddContact({ onContactAdded }) {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_id = localStorage.getItem('user_id');  // ✅ Get stored user_id
      console.log("User ID being sent:", user_id);       // ✅ Debug log
  
      if (!user_id) {
        setMessage('User not logged in.');
        return;
      }
  
      // Ensure all fields are filled before sending
      if (!contact.name || !contact.email || !contact.phone) {
        setMessage('Please fill all the fields.');
        return;
      }
  
      // Send POST request with contact + user_id
      await axios.post('http://localhost:5000/contacts', {
        ...contact,
        user_id: parseInt(user_id),  // ✅ convert to integer if needed
      });
  
      setMessage('Contact added successfully!');
      setContact({ name: '', email: '', phone: '' });
      if (onContactAdded) onContactAdded();  // Optional callback
    } catch (error) {
      console.error('Error adding contact:', error);
      if (error.response?.data?.error) {
        setMessage(`Failed: ${error.response.data.error}`);
      } else {
        setMessage('Failed to add contact.');
      }
    }
  };
  
  
  

  return (
    <div>
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={contact.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={contact.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={contact.phone} onChange={handleChange} required />
        <button type="submit">Add</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddContact;
