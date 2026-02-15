import React from 'react';

const MovieCard = ({ movie, onClick, actionIcon = null }) => {
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Sem+Poster';

    return (
        <div 
            onClick={() => onClick(movie)}
            className="group relative bg-gray-850 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 border border-gray-700 hover:border-primary-500"
        >
            <div className="aspect-[2/3] w-full overflow-hidden">
                <img 
                    src={posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-3">
                <h3 className="text-text-primary font-montserrat font-bold text-sm truncate">{movie.title}</h3>
                <p className="text-text-secondary text-xs">{year}</p>
            </div>

            {actionIcon && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {actionIcon}
                </div>
            )}
        </div>
    );
};

export default MovieCard;