import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storedToken = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user_data');

            if (storedToken && storedUser) {
                api.defaults.headers.Authorization = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }

        loadStorageData();
    }, []);

    async function login(email, password) {
        const response = await api.post('/login', { email, password });

        const { access_token, user } = response.data;

        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        setUser(user);
    }

    function logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        api.defaults.headers.Authorization = null;
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};