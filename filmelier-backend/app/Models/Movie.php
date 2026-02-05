<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Movie extends Model
{
    protected $fillable = [
        'tmdb_id',
        'title',
        'overview',
        'poster_path',
        'release_date',
        'vote_average'
    ];

    // Relacionamento com Gêneros (Muitos para Muitos)
    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'genre_movie');
    }
    
    // Relacionamento com Usuários (Biblioteca)
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_movie_library')
                    ->withPivot('comment')
                    ->withTimestamps();
    }
}
