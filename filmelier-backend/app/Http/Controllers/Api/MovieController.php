<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function search(Request $request)
    {
        // Obtém o termo de busca enviado pelo parâmetro 'q'
        $query = $request->input('q');

        if (!$query) {
            return response()->json([], 200);
        }

        // Realiza a busca no banco de dados local
        // Usamos ILIKE (no Postgres) ou LIKE (no MySQL) para busca parcial e insensível a maiúsculas
        $movies = Movie::with('genres')
            ->where('title', 'ILIKE', "%{$query}%")
            ->orderBy('vote_average', 'desc') // Mostra os melhores avaliados primeiro
            ->limit(15) // Limita a 15 resultados para ser ultra rápido
            ->get();

        // Retornamos os dados no mesmo formato que o TMDb retornava
        // para não quebrar o seu Frontend
        return response()->json($movies);
    }
}