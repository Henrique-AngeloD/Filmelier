import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ao abrir o site, verifica se já tem um token salvo no navegador
    useEffect(() => {
        async function loadStorageData() {
            const storedToken = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('user_data');

            if (storedToken && storedUser) {
                // Configura o token no Axios para as próximas chamadas
                api.defaults.headers.Authorization = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }

        loadStorageData();
    }, []);

    // Função de Login
    async function login(email, password) {
        // 1. Chama o Laravel
        const response = await api.post('/login', { email, password });

        // 2. Recebe os dados
        const { access_token, user } = response.data;

        // 3. Salva no navegador (persistência)
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // 4. Configura o Axios e o Estado
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        setUser(user);
    }

    // Função de Logout
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

// Hook personalizado para facilitar o uso
export const useAuth = () => {
    return useContext(AuthContext);
};

//-----------------------------------------PARA TESTES: MOCKANDO O CONTEXTO DE AUTENTICAÇÃO-----------------------------------------//

// import { createContext, useState, useEffect, useContext } from 'react';
// // import api from '../services/api'; // Comente a API por enquanto

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     // ESTADO MOCKADO (SIMULADO)
//     // Dizemos que já existe um usuário logado chamado Henrique
//     const [user, setUser] = useState({ name: 'Henrique', email: 'henrique@teste.com' });
//     const [loading, setLoading] = useState(false); // Não está carregando nada

//     // Funções vazias só para não quebrar o código
//     async function login(email, password) {
//         console.log("Login simulado com:", email);
//         setUser({ name: 'Henrique', email });
//     }

//     function logout() {
//         setUser(null);
//     }

//     return (
//         // signed é true se user existir
//         <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };