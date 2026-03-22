import axios from 'axios';

const BACKEND_HOST = "http://localhost:3331/api";


export const API = axios.create({
  baseURL: BACKEND_HOST,
});


