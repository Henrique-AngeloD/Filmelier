import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Usamos a API direto aqui pois o Contexto geralmente só tem Login
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            // 1. Criar o usuário no Laravel
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });

            // 2. Se deu certo, já faz o login automático
            await login(email, password);
            navigate('/'); 

        } catch (err) {
            if (err.response && err.response.data.errors) {
                // Pega o primeiro erro que o Laravel devolveu (ex: Email já existe)
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Erro ao registrar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-900 p-8">
                {/* Abas de Navegação */}
                <div className="flex justify-center mb-8 border-b border-gray-700">
                    <Link to="/login" className="pb-2 text-text-secondary font-montserrat font-bold text-xl px-4 hover:text-text-primary transition-colors">
                        Login
                    </Link>
                    <span className="pb-2 border-b-2 border-primary-500 text-text-primary font-montserrat font-bold text-xl px-4 cursor-default">
                        Registrar
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Input 
                        label="Nome" 
                        type="text" 
                        placeholder="Seu Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Input 
                        label="Email" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input 
                        label="Senha" 
                        type="password" 
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input 
                        label="Confirmar Senha" 
                        type="password" 
                        placeholder="******"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <div className="mt-8">
                        <Button text="Registrar" type="submit" disabled={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;