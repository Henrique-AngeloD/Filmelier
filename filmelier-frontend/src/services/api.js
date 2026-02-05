import axios from 'axios';

// Cria uma instância do Axios com a URL base do seu Laravel
const api = axios.create({
    // Se estiver usando php artisan serve, geralmente é a porta 8000
    baseURL: 'http://127.0.0.1:8000/api',
    
    // Importante: Diz ao Laravel que queremos respostas em JSON
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptador: Antes de cada requisição, coloca o Token se ele existir
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;