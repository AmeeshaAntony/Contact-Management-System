import axios from 'axios';

const API_URL = 'http://localhost:5000/contacts'; // Replace with your backend API URL

export const getContacts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const addContact = async (contact) => {
  try {
    const response = await axios.post(API_URL, contact);
    return response.data;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};
