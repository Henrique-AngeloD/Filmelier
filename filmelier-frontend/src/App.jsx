import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Library from './pages/Library'; 
import Recommendations from './pages/Recommendations';

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
        <ToastProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
            
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
                        <Route path="/recommendations" element={
                            <PrivateRoute>
                                <Recommendations />
                            </PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App