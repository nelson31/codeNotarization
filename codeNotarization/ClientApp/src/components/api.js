import axios from 'axios';

export const REGISTERS_URL = 'https://localhost:5001/registers';
export const DOCUMENTS_URL = 'https://localhost:5001/documents';

const api = axios.create({
    baseURL: `https://localhost:5001/`
});

api.interceptors.request.use(async (config) => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (err) {
        console.log("erro api");
    }
});

export default api;
