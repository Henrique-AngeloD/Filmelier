<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LibraryController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // O orderBy garante que os últimos assistidos apareçam primeiro
        $movies = $user->libraryMovies()
            ->orderBy('user_movie_library.created_at', 'desc')
            ->get();

        return response()->json($movies);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tmdb_id' => 'required|integer',
            'comment' => 'nullable|string',
            'rating'  => 'nullable|integer|min:0|max:10' // Adicionado
        ]);

        $movie = Movie::find($request->tmdb_id);

        if (!$movie) {
            return response()->json(['message' => 'Filme não encontrado no banco local.'], 404);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->libraryMovies()->syncWithoutDetaching([
            $movie->id => [
                'comment' => $request->comment,
                'rating'  => $request->rating, // Adicionado
                'watched' => true
            ]
        ]);

        return response()->json(['message' => 'Filme adicionado à biblioteca!'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'comment' => 'nullable|string',
            'rating'  => 'nullable|integer|min:0|max:10' // Adicionado
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->libraryMovies()->updateExistingPivot($id, [
            'comment' => $request->comment,
            'rating'  => $request->rating // Adicionado
        ]);

        return response()->json(['message' => 'Biblioteca atualizada!']);
    }

    public function destroy($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $user->libraryMovies()->detach($id);
        
        return response()->json(['message' => 'Filme removido da biblioteca.']);
    }
}