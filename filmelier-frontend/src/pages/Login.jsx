import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            showToast('Credenciais inválidas. Verifique seu e-mail e senha.', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-900 p-8">
                <div className="flex justify-center mb-8 border-b border-gray-700">
                    <span className="pb-2 border-b-2 border-primary-500 text-text-primary font-montserrat font-bold text-xl px-4 cursor-default">
                        Login
                    </span>
                    <Link to="/register" className="pb-2 text-text-secondary font-montserrat font-bold text-xl px-4 hover:text-text-primary transition-colors">
                        Registrar
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Email" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <Input 
                        label="Senha" 
                        type="password" 
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div className="mt-8">
                        <Button
                            text="Entrar"
                            type="submit"
                            loading={loading}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <a href="#" className="text-sm text-text-secondary hover:text-primary-500 transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;