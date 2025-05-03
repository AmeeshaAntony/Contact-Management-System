
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Flask server URL

export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/register`, userData);
};
