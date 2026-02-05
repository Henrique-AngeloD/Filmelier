import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Função para verificar se o link está ativo (deixa dourado)
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gray-900 border-b border-gray-700 py-4 px-6 mb-8">
            <div className="w-full flex justify-between items-center">
                
                {/* Logo / Nome do App */}
                <Link to="/" className="text-2xl font-montserrat font-bold text-primary-500 hover:text-primary-600 transition-colors">
                    Filmelier
                </Link>

                {/* Links de Navegação */}
                <div className="flex gap-8 items-center">
                    <Link 
                        to="/" 
                        className={`font-montserrat font-bold text-lg transition-colors ${isActive('/') ? 'text-primary-500 border-b-2 border-primary-500' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Início
                    </Link>
                    
                    <Link 
                        to="/library" 
                        className={`font-montserrat font-bold text-lg transition-colors ${isActive('/library') ? 'text-primary-500 border-b-2 border-primary-500' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Biblioteca
                    </Link>
                </div>

                {/* Área do Usuário */}
                <div className="flex items-center gap-4">
                    <span className="text-text-primary text-sm hidden md:block">
                        Olá, <span className="font-bold">{user?.name}</span>
                    </span>
                    <button 
                        onClick={logout}
                        className="text-sm text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded transition-colors cursor-pointer"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;