import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Modal from '../components/Modal';
import Button from '../components/Button';

const Library = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados do Modal
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // 1. Buscar filmes da biblioteca ao carregar a página
    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        try {
            const response = await api.get('/library');
            setMovies(response.data);
        } catch (error) {
            console.error("Erro ao carregar biblioteca:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Abrir Modal com detalhes do filme
    const openModal = (movie) => {
        setSelectedMovie(movie);
        // O comentário vem dentro do objeto 'pivot' (relação do Laravel)
        setComment(movie.pivot?.comment || ''); 
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setComment('');
    };

    // 3. Salvar Comentário (Update)
    const handleSaveComment = async () => {
        if (!selectedMovie) return;
        setIsSaving(true);
        try {
            await api.put(`/library/${selectedMovie.id}`, {
                comment: comment
            });
            // Atualiza a lista localmente para refletir a mudança sem recarregar tudo
            setMovies(movies.map(m => 
                m.id === selectedMovie.id 
                ? { ...m, pivot: { ...m.pivot, comment } } 
                : m
            ));
            alert('Comentário salvo com sucesso!');
            closeModal();
        } catch (error) {
            alert('Erro ao salvar comentário.');
        } finally {
            setIsSaving(false);
        }
    };

    // 4. Remover Filme (Delete)
    const handleRemove = async () => {
        if (!selectedMovie || !window.confirm("Tem certeza que deseja remover este filme?")) return;
        
        try {
            await api.delete(`/library/${selectedMovie.id}`);
            // Remove da lista visualmente
            setMovies(movies.filter(m => m.id !== selectedMovie.id));
            closeModal();
        } catch (error) {
            alert('Erro ao remover filme.');
        }
    };

    // Formata a data (ex: 2023-11-15 -> 15/11/2023)
    const formatDate = (dateString) => {
        if (!dateString) return 'Data desconhecida';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-10 font-inter">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 mt-8">
                
                {/* Cabeçalho (Página 2 do PDF) */}
                <div className="mb-10 pb-6">
                    <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-text-primary mb-2">
                        Minha Biblioteca
                    </h1>
                    <p className="text-text-secondary">
                        Guarde todos os filmes que você já assistiu e suas opiniões pessoais.
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-20 text-primary-500 animate-pulse">Carregando sua coleção...</div>
                ) : (
                    <>
                        {/* Estado Vazio */}
                        {movies.length === 0 && (
                            <div className="text-center py-20 bg-gray-850 rounded-xl border border-gray-800 border-dashed">
                                <p className="text-text-secondary text-lg mb-4">Sua biblioteca está vazia.</p>
                                <p className="text-gray-500 text-sm">Vá para o Início e pesquise filmes para adicionar.</p>
                            </div>
                        )}

                        {/* Grid de Filmes */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map(movie => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={movie} 
                                    onClick={openModal} // Ao clicar, abre o modal
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* MODAL DE DETALHES (Página 6 do PDF) */}
                <Modal 
                    isOpen={!!selectedMovie} 
                    onClose={closeModal} 
                    title="Detalhes do Filme"
                >
                    {selectedMovie && (
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Coluna Esquerda: Poster */}
                            <div className="w-full md:w-1/3">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                                    alt={selectedMovie.title} 
                                    className="w-full rounded-lg shadow-lg"
                                />
                                <div className="mt-4 text-center">
                                    <span className="inline-block bg-primary-500 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                                        Nota: {selectedMovie.vote_average?.toFixed(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Coluna Direita: Informações */}
                            <div className="w-full md:w-2/3 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-montserrat font-bold text-text-primary">
                                        {selectedMovie.title}
                                    </h2>
                                    <p className="text-sm text-text-secondary mt-1">
                                        Assistido em: <span className="text-primary-500 font-bold">
                                            {formatDate(selectedMovie.pivot?.created_at)}
                                        </span>
                                    </p>
                                </div>

                                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                    <h4 className="text-primary-500 font-bold text-sm mb-2 uppercase">Resumo</h4>
                                    <p className="text-text-secondary text-sm leading-relaxed">
                                        {selectedMovie.overview || "Sem resumo disponível."}
                                    </p>
                                </div>

                                {/* Área de Comentário Pessoal */}
                                <div>
                                    <label className="block text-text-secondary text-sm font-bold mb-2">
                                        Seu Comentário Pessoal:
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="O que você achou deste filme?"
                                        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-text-primary focus:border-primary-500 focus:outline-none resize-none"
                                    />
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        text={isSaving ? "Salvando..." : "Salvar Comentário"} 
                                        onClick={handleSaveComment}
                                        disabled={isSaving}
                                    />
                                    <button 
                                        onClick={handleRemove}
                                        className="px-4 py-3 border border-red-900 text-red-400 hover:bg-red-900/20 rounded-lg font-bold transition-colors cursor-pointer"
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