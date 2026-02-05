<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'genre_ids' => 'required|array',       // IDs dos gêneros (ex: [28, 12])
            'exclude_tmdb_ids' => 'array',         // IDs dos filmes selecionados (para não recomendar o mesmo)
            'titles' => 'array'                    // Nomes dos filmes (para mostrar no "Baseado em")
        ]);

        $user = Auth::user();
        
        // 1. Recebemos os IDs do TMDb direto do Frontend (ex: 28 = Ação)
        $tmdbGenreIds = $request->genre_ids;
        $excludeIds = $request->exclude_tmdb_ids ?? [];

        // 2. Traduzimos para os IDs do nosso banco local
        // (Ex: O ID 28 do TMDb pode ser o ID 5 na nossa tabela 'genres')
        $localGenreIds = Genre::whereIn('tmdb_id', $tmdbGenreIds)->pluck('id');

        /** @var \App\Models\User $user */
        // 3. Identificar filmes que o usuário já viu (para excluir)
        $watchedMovieIds = $user ? $user->libraryMovies()->pluck('movies.id') : [];

        // 4. Buscar filmes no banco local que tenham esses gêneros
        $recommendations = Movie::whereHas('genres', function ($query) use ($localGenreIds) {
            $query->whereIn('genres.id', $localGenreIds);
        })
        ->whereNotIn('tmdb_id', $excludeIds) // Não recomendar os que o user escolheu agora
        ->whereNotIn('id', $watchedMovieIds) // Não recomendar os que já viu
        ->with('genres')                     // Trazer os gêneros junto
        ->inRandomOrder()                    // Misturar para não vir sempre os mesmos
        ->limit(3)
        ->get();

        return response()->json([
            'based_on' => $request->titles ?? [],
            'recommendations' => $recommendations
        ]);
    }
}