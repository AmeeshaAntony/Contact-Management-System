import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditContactReact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contactId = new URLSearchParams(window.location.search).get('id');
        const response = await axios.get(`http://localhost:5000/contacts/${contactId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact:', error);
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contactId = new URLSearchParams(window.location.search).get('id');
      await axios.put(`http://localhost:5000/contacts/${contactId}`, formData);
      alert('Contact updated successfully!');
      window.location.href = '/viewcontacts';
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact');
    }
  };

  if (loading) {
    return <div>Loading contact details...</div>;
  }

  return (
    <div className="edit-contact-container">
      <h2>Edit Contact</h2>
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
        <button type="submit">Update Contact</button>
      </form>
      <style jsx>{`
        .edit-contact-container {
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
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default EditContactReact; 