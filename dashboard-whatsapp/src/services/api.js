// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // sua API local do bot
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
