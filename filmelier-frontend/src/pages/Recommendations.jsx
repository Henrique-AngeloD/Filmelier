import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import api from '../services/api';

const Recommendations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const { data } = location.state || {};
    
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!data) {
            navigate('/');
        }
    }, [data, navigate]);

    if (!data) return null;

    const { based_on, recommendations } = data;

    const addToLibrary = async () => {
        if (!selectedMovie) return;
        setAdding(true);

        try {
            await api.post('/library', {
                tmdb_id: selectedMovie.tmdb_id || selectedMovie.id,
                title: selectedMovie.title,
                overview: selectedMovie.overview,
                poster_path: selectedMovie.poster_path,
                vote_average: selectedMovie.vote_average,
                release_date: selectedMovie.release_date
            });
            setSelectedMovie(null);
            showToast('Adicionado com sucesso!');
        } catch (error) {
            console.error(error);
            showToast('Erro ao adicionar na biblioteca', 'error');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-10 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 mt-8">
                
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-montserrat font-bold text-primary-500 mb-2">
                        Recomendações para você
                    </h1>
                    <p className="text-text-secondary">
                        Baseado em: <span className="text-text-primary font-bold">{based_on.join(', ')}</span>
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
                    {recommendations.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onClick={(m) => setSelectedMovie(m)} 
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-text-secondary hover:text-primary-500 underline"
                    >
                        Fazer nova busca
                    </button>
                </div>

                <Modal 
                    isOpen={!!selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    title={selectedMovie?.title}
                >
                    {selectedMovie && (
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                                    alt={selectedMovie.title} 
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="w-full md:w-2/3 space-y-4">
                                <p className="text-sm text-text-secondary">
                                    Lançamento: {selectedMovie.release_date?.split('-')[0]}
                                </p>
                                <p className="text-text-secondary leading-relaxed">
                                    {selectedMovie.overview}
                                </p>
                                <div className="pt-4">
                                    <Button 
                                        text={adding ? "Adicionando..." : "Adicionar à Minha Biblioteca"} 
                                        onClick={addToLibrary}
                                        disabled={adding}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

            </div>
        </div>
        
    );
};

export default Recommendations;