
import axios from 'axios';

// Use an environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const calculatePlaylistDuration = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/calculate`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
