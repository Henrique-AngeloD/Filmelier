import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            showToast('As senhas não coincidem.', 'error');
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });

            await login(email, password);
            showToast('Conta criada com sucesso!');
            navigate('/'); 

        } catch (err) {
            showToast('Erro ao registrar. Tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-900 p-8">
                <div className="flex justify-center mb-8 border-b border-gray-700">
                    <Link to="/login" className="pb-2 text-text-secondary font-montserrat font-bold text-xl px-4 hover:text-text-primary transition-colors">
                        Login
                    </Link>
                    <span className="pb-2 border-b-2 border-primary-500 text-text-primary font-montserrat font-bold text-xl px-4 cursor-default">
                        Registrar
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
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
                        <Button 
                            text="Registrar"
                            type="submit"
                            loading={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;