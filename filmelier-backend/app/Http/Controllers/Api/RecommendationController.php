<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    public function generate(Request $request)
    {
        $genreIds = $request->genre_ids; // Ex: [28, 12]
        $excludeIds = $request->exclude_tmdb_ids ?? [];

        $user = Auth::user();

        /** @var \App\Models\User $user */
        $watchedMovieIds = $user ? $user->libraryMovies()->pluck('movies.id')->toArray() : [];
        $ignoreList = array_merge($excludeIds, $watchedMovieIds);
        $genreList = implode(',', array_map('intval', $genreIds));

        $recommendations = Movie::select('movies.*')
            ->selectRaw("(
                SELECT count(*) 
                FROM jsonb_array_elements_text(genre_ids) as elem 
                WHERE elem::int IN ($genreList)
            ) as relevance_score")
            ->where(function ($query) use ($genreIds) {
                foreach ($genreIds as $id) {
                    $query->orWhereJsonContains('genre_ids', (int)$id);
                }
            })
            ->when(!empty($ignoreList), function ($query) use ($ignoreList) {
                return $query->whereNotIn('movies.id', $ignoreList);
            })
            ->where('vote_average', '>=', 6.0)
            ->orderByDesc('relevance_score')
            ->orderByDesc('vote_average')
            ->inRandomOrder()
            ->limit(3)
            ->get();

        return response()->json([
            'based_on' => $request->titles ?? [],
            'recommendations' => $recommendations
        ]);
    }
}