import React, { useState } from 'react';
import axios from 'axios';

function AddContactReact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/contacts', formData);
      alert('Contact added successfully!');
      setFormData({ name: '', email: '', phone: '' }); // Reset form
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  };

  return (
    <div className="add-contact-container">
      <h2>Add New Contact</h2>
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
        <button type="submit">Add Contact</button>
      </form>
      <style jsx>{`
        .add-contact-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
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
          background-color: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}

export default AddContactReact; 