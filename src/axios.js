import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1/user',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('accessToken')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;
