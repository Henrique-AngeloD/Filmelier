import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Modal from '../components/Modal';
import Button from '../components/Button';

const Library = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);    
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const { showToast } = useToast();

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        try {
            const response = await api.get('/library');
            setMovies(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            showToast('Erro ao carregar biblioteca', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setComment(movie.pivot?.comment || ''); 
        setRating(movie.pivot?.rating || 0);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setComment('');
        setRating(0);
    };

    const handleSaveDetails = async () => {
        if (!selectedMovie) return;
        setLoading(true);
        try {
            await api.put(`/library/${selectedMovie.id}`, {
                comment: comment,
                rating: rating
            });

            setMovies(movies.map(m => 
                m.id === selectedMovie.id 
                ? { ...m, pivot: { ...m.pivot, comment, rating } } 
                : m
            ));

            closeModal();
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvas as alterações', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!selectedMovie || !window.confirm("Tem certeza que deseja remover este filme?")) return;
        
        try {
            await api.delete(`/library/${selectedMovie.id}`);
            setMovies(movies.filter(m => m.id !== selectedMovie.id));
            closeModal();
        } catch (error) {
            showToast('Erro ao remover filme', 'error');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data desconhecida';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
        } catch (e) {
            return 'Erro na data';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-10 font-inter text-text-primary overflow-x-hidden">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 mt-8">
                
                <div className="mb-10 pb-6 border-b border-gray-800">
                    <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-text-primary mb-2">
                        Minha Biblioteca
                    </h1>
                    <p className="text-text-secondary">
                        A sua coleção pessoal
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-primary-500 font-montserrat">Carrengando coleção...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map(movie => (
                            <div key={movie.id} className="relative group">
                                <MovieCard movie={movie} onClick={openModal} />
                                {movie.pivot?.rating > 0 && (
                                    <div className="absolute top-2 right-2 z-10 bg-primary-500 text-gray-900 font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-xs border-2 border-gray-900">
                                        {movie.pivot.rating}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <Modal 
                    isOpen={!!selectedMovie} 
                    onClose={closeModal} 
                    title="Detalhes e Avaliação"
                >
                    {selectedMovie && (
                        <div className="flex flex-col md:flex-row gap-8 max-w-full overflow-hidden">
                            <div className="w-full md:w-1/3 flex-shrink-0">
                                <img 
                                    src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Poster'} 
                                    alt={selectedMovie.title} 
                                    className="w-full rounded-lg shadow-lg border border-gray-700"
                                />
                                <div className="mt-4 p-3 bg-gray-850 rounded-lg border border-gray-800 text-center">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Nota Global TMDb</p>
                                    <span className="text-primary-500 font-montserrat font-bold text-lg">
                                        ★ {selectedMovie.vote_average ? Number(selectedMovie.vote_average).toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 space-y-5 overflow-hidden">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-text-primary leading-tight truncate">
                                        {selectedMovie.title}
                                    </h2>
                                    <p className="text-xs text-text-secondary mt-1">
                                        Assistido em: <span className="text-primary-500 font-bold">{formatDate(selectedMovie.pivot?.created_at)}</span>
                                    </p>
                                </div>

                                <div className="bg-gray-850/50 p-4 rounded-lg border border-gray-800">
                                    <h4 className="text-primary-500 font-bold text-[10px] mb-2 uppercase tracking-widest">Resumo</h4>
                                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-4 md:line-clamp-none">
                                        {selectedMovie.overview || "Sem resumo disponível."}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-primary-500 text-[10px] font-bold mb-3 uppercase tracking-wider">
                                        Sua Nota:
                                    </label>
                                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => setRating(num)}
                                                className={`
                                                    h-9 rounded-lg font-bold text-sm transition-all border flex items-center justify-center
                                                    ${rating === num 
                                                        ? 'bg-primary-500 border-primary-500 text-gray-900 scale-105 shadow-lg shadow-primary-500/20' 
                                                        : 'bg-gray-800 border-gray-700 text-text-secondary hover:border-primary-500'}
                                                `}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-primary-500 text-[10px] font-bold mb-2 uppercase tracking-wider">
                                        Comentário:
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="O que achou do filme?"
                                        className="w-full h-32 bg-gray-700 border border-gray-600 rounded-xl p-4 text-text-primary focus:border-primary-500 focus:outline-none resize-none transition-colors shadow-inner placeholder-gray-400"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-800">
                                    <div className="flex-1">
                                        <Button 
                                            text='Salvar' 
                                            onClick={handleSaveDetails}
                                            loading={loading}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleRemove}
                                        className="px-6 py-3 border border-red-900/50 text-red-500 hover:bg-red-500/10 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Library;