import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/contacts?user_id=${user_id}`);
        setContacts(res.data);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    if (user_id) fetchContacts();
  }, [user_id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`);
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  return (
    <div>
      <h2>Your Contacts</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            {contact.name} - {contact.phone} - {contact.email}
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContactList;
