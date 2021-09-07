import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'nextauth.token': token } = parseCookies();

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export default api;
