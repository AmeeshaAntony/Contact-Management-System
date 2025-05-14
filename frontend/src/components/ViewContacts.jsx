import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/contacts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const userContacts = response.data.filter(
        contact => contact.user_id === parseInt(localStorage.getItem('user_id'))
      );
      setContacts(userContacts);
    } catch (error) {
      setError('Failed to fetch contacts');
    }
  };

  const handleEdit = (contactId) => {
    navigate(`/edit-contact/${contactId}`);
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${contactId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchContacts();
    } catch (error) {
      setError('Failed to delete contact');
    }
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h1>My Contacts</h1>
        <button className="add-contact-btn" onClick={() => navigate('/add-contact')}>
          Add New Contact
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="contacts-list">
        {contacts.length === 0 ? (
          <p className="no-contacts">No contacts found. Add your first contact!</p>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <h3>{contact.name}</h3>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phone}</p>
              <div className="contact-actions">
                <button onClick={() => handleEdit(contact.id)}>Edit</button>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewContacts; 