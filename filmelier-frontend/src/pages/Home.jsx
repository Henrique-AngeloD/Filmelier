import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Home = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (query.length <= 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await api.get(`/search?q=${query}`);
                const validMovies = response.data.filter(m => m.poster_path);
                setSearchResults(validMovies.slice(0, 5));
            } catch (error) {
                showToast('Erro na busca', 'error');
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const selectMovie = (movie) => {
        if (selectedMovies.length >= 3) return; 
        if (selectedMovies.find(m => m.id === movie.id)) return; 

        setSelectedMovies([...selectedMovies, movie]);
        setQuery('');
        setSearchResults([]);
    };

    const removeMovie = (movieId) => {
        setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
    };

    const generateRecommendations = async () => {
        if (selectedMovies.length !== 3) return;
        setLoading(true);
        
        try {
            const allGenres = selectedMovies.flatMap(m => m.genre_ids || []);
            const uniqueGenres = [...new Set(allGenres)];

            const response = await api.post('/recommend', {
                genre_ids: uniqueGenres,
                exclude_tmdb_ids: selectedMovies.map(m => m.id),
                titles: selectedMovies.map(m => m.title)
            });
            
            navigate('/recommendations', { state: { data: response.data } });

        } catch (error) {
            showToast('Erro ao gerar recomendações, tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-10 font-inter">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 mt-8">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-text-primary mb-4 leading-tight">
                        Descubra novos filmes <br/> que combinam com você
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Escolha 3 filmes que você gosta, nós cuidamos do resto.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
                    {[0, 1, 2].map((index) => (
                        <div 
                            key={index} 
                            className={`
                                relative aspect-[2/3] rounded-xl border-2 border-dashed 
                                flex items-center justify-center overflow-hidden group transition-colors
                                ${selectedMovies[index] ? 'border-primary-500 bg-gray-850' : 'border-gray-700 bg-gray-850/50'}
                            `}
                        >
                            {selectedMovies[index] ? (
                                <>
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${selectedMovies[index].poster_path}`} 
                                        alt={selectedMovies[index].title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button 
                                            onClick={() => removeMovie(selectedMovies[index].id)}
                                            className="bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600 transition flex items-center justify-center font-bold text-xl cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-700 font-bold text-4xl select-none font-montserrat">
                                    {index + 1}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="relative mb-12 z-50 max-w-3xl mx-auto">
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Busque um filme..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={selectedMovies.length >= 3}
                            className={`
                                w-full bg-gray-850 border text-text-primary text-lg rounded-full py-4 px-6 pl-12
                                focus:outline-none focus:border-primary-500 transition-colors placeholder-gray-600 shadow-xl
                                ${selectedMovies.length >= 3 ? 'opacity-50 cursor-not-allowed border-gray-800' : 'border-gray-700'}
                            `}
                        />
                        
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {isSearching ? (
                                <svg className="animate-spin h-5 w-5 text-primary-500" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            )}
                        </div>
                    </div>
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-850 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                            {searchResults.map(movie => (
                                <div 
                                    key={movie.id}
                                    onClick={() => selectMovie(movie)}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800 last:border-0 group"
                                >
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                        alt={movie.title}
                                        className="w-12 h-18 object-cover rounded bg-gray-700"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-text-primary font-bold font-montserrat text-sm md:text-base group-hover:text-primary-500 transition-colors">
                                            {movie.title}
                                        </h4>
                                        <p className="text-text-secondary text-xs mt-1">
                                            {movie.release_date?.split('-')[0]}
                                        </p>
                                    </div>
                                    <div className="px-3 text-gray-600 group-hover:text-primary-500 text-2xl font-bold transition-colors">
                                        +
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="max-w-xs mx-auto text-center">
                    <Button 
                        text="Gerar Recomendações" 
                        onClick={generateRecommendations}
                        disabled={selectedMovies.length < 3}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;