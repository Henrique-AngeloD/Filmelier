<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LibraryController extends Controller
{
    /**
     * Lista os filmes da biblioteca do usuário.
     */
    public function index()
    {
        // Retorna os filmes com os dados da tabela pivô (comentário e data)
        $movies = Auth::user()->libraryMovies()->orderBy('user_movie_library.created_at', 'desc')->get();
        return response()->json($movies);
    }

    /**
     * Adiciona um filme à biblioteca.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tmdb_id' => 'required|integer',
            'comment' => 'nullable|string'
        ]);

        // Verifica se o filme já existe no nosso banco local (cache)
        $movie = Movie::where('tmdb_id', $request->tmdb_id)->first();

        // Se não existir, o frontend deveria enviar os dados para criarmos o cache aqui
        // ou você pode buscar na API do TMDb agora.
        if (!$movie) {
            return response()->json(['message' => 'Filme não encontrado no banco local. Busque-o primeiro.'], 404);
        }

        // Adiciona à biblioteca do usuário logado
        // syncWithoutDetaching evita duplicatas e mantém o que já existe
        Auth::user()->libraryMovies()->syncWithoutDetaching([
            $movie->id => [
                'comment' => $request->comment,
                'watched' => true
            ]
        ]);

        return response()->json(['message' => 'Filme adicionado à biblioteca!'], 201);
    }

    /**
     * Atualiza o comentário de um filme na biblioteca.
     */
    public function update(Request $request, $id)
    {
        $request->validate(['comment' => 'nullable|string']);

        Auth::user()->libraryMovies()->updateExistingPivot($id, [
            'comment' => $request->comment
        ]);

        return response()->json(['message' => 'Comentário atualizado!']);
    }

    /**
     * Remove um filme da biblioteca.
     */
    public function destroy($id)
    {
        Auth::user()->libraryMovies()->detach($id);
        return response()->json(['message' => 'Filme removido da biblioteca.']);
    }
}