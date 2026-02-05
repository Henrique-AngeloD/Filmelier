<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{
    /**
     * Busca filmes na API do TMDb.
     * Rota: GET /api/search?q=NomeDoFilme
     */
    public function search(Request $request)
    {
        // 1. Pega o termo que o usuário digitou (ex: "Batman")
        $query = $request->input('q');

        // Se não digitou nada, retorna lista vazia
        if (!$query) {
            return response()->json([], 200);
        }

        $apiKey = env('TMDB_API_KEY');

        // 2. O Laravel atua como um "Proxy"
        // Ele chama a API do TMDb pelo backend.
        // O 'withoutVerifying()' é vital para evitar erros de SSL no Windows local.
        $response = Http::get("https://api.themoviedb.org/3/search/movie", [
            'api_key' => $apiKey,
            'language' => 'pt-BR',
            'query' => $query,
            'page' => 1
        ]);

        // 3. Devolve o resultado para o React
        if ($response->successful()) {
            return response()->json($response->json()['results']);
        }

        return response()->json(['error' => 'Falha ao comunicar com TMDb'], 500);
    }
}