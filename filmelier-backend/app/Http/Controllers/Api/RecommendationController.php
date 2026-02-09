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
            'genre_ids' => 'required|array',
            'exclude_tmdb_ids' => 'array',
            'titles' => 'array'
        ]);

        $user = Auth::user();
        
        $tmdbGenreIds = $request->genre_ids;
        $excludeIds = $request->exclude_tmdb_ids ?? [];

        $localGenreIds = Genre::whereIn('tmdb_id', $tmdbGenreIds)->pluck('id');

        /** @var \App\Models\User $user */
        $watchedMovieIds = $user ? $user->libraryMovies()->pluck('movies.id') : [];

        $recommendations = Movie::whereHas('genres', function ($query) use ($localGenreIds) {
            $query->whereIn('genres.id', $localGenreIds);
        })
        ->whereNotIn('tmdb_id', $excludeIds)
        ->whereNotIn('id', $watchedMovieIds)
        ->with('genres')
        ->inRandomOrder()
        ->limit(3)
        ->get();

        return response()->json([
            'based_on' => $request->titles ?? [],
            'recommendations' => $recommendations
        ]);
    }
}