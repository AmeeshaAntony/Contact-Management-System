import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewContactsReact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contacts');
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  if (loading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div className="contacts-container">
      <h2>Your Contacts</h2>
      <div className="contacts-list">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <h3>{contact.name}</h3>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .contacts-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .contacts-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .contact-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
}

export default ViewContactsReact; 