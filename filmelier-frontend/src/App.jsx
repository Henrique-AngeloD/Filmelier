import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css'

// Importando as Páginas (Essenciais para não dar tela branca)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library'; 
import Recommendations from './pages/Recommendations';

// Componente que protege as rotas (Só deixa passar se tiver logado)
const PrivateRoute = ({ children }) => {
    const { signed, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-primary-500 font-montserrat">Carregando Filmelier...</div>;
    }

    if (!signed) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
  return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Rotas Públicas (Qualquer um acessa) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Rotas Privadas (Só logado acessa) */}
                     <Route path="/" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/library" element={
                        <PrivateRoute>
                            <Library />
                        </PrivateRoute>
                    } />

                    {/* Resultados da Recomendação */}
                    <Route path="/recommendations" element={
                        <PrivateRoute>
                            <Recommendations />
                        </PrivateRoute>
                    } />

                    {/* Qualquer outra rota joga para a Home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App


//---------------PARA TESTES MOCKADOS-----------------


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';

// // Importando apenas a Home (já que é a única que você quer ver agora)
// import Home from './pages/Home';

// function App() {
//     return (
//         <BrowserRouter>
//             {/* O AuthProvider é necessário porque a Navbar dentro da Home usa dados do usuário */}
//             <AuthProvider>
//                 <Routes>
//                     {/* Rota única: Qualquer acesso vai para a Home */}
//                     <Route path="/" element={<Home />} />
                    
//                     {/* (Opcional) Captura qualquer outra rota e manda para a Home também */}
//                     <Route path="*" element={<Home />} />
//                 </Routes>
//             </AuthProvider>
//         </BrowserRouter>
//     );
// }

// export default App;