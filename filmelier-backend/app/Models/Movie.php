<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Movie extends Model
{
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'title',
        'genre_ids',
        'overview',
        'poster_path',
        'vote_average',
        'release_date'
    ];

    protected $casts = [
        'genre_ids' => 'array',
    ];

    //protected $appends = ['genre_ids'];

    // public function genres(): BelongsToMany
    // {
    //     return $this->belongsToMany(Genre::class, 'genre_movie');
    // }

    // public function getGenreIdsAttribute()
    // {
    //     // Se a relação de gêneros já estiver carregada, extraímos os IDs
    //     if ($this->relationLoaded('genres')) {
    //         return $this->genres->pluck('id')->toArray();
    //     }
        
    //     return [];
    // }
    
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_movie_library')
                    ->withPivot('comment')
                    ->withTimestamps();
    }
}
