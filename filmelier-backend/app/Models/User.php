<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- Importante para Login
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // <--- Importante para o relacionamento

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * -------------------------------------------------------------
     * RELACIONAMENTOS (Aqui está a correção do seu erro)
     * -------------------------------------------------------------
     * Esta função ensina ao Laravel que o User tem uma biblioteca de filmes.
     */
    public function libraryMovies(): BelongsToMany
    {
        return $this->belongsToMany(Movie::class, 'user_movie_library')
                    ->withPivot('comment', 'watched')
                    ->withTimestamps();
    }
}