import axios from 'axios';
import { API_URL } from './config';
import { uiStore } from './store/uiStore';

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
    uiStore.setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    uiStore.setLoading(false);
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    uiStore.setLoading(false);
    return response;
}, (error) => {
    uiStore.setLoading(false);
    const message = error.response?.data?.message || 'Error en la conexión';
    uiStore.showNotification(message, 'error');
    return Promise.reject(error);
});

export default apiClient;
