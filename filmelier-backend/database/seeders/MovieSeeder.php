<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Movie;
use App\Models\Genre;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apiKey = env('TMDB_API_KEY');

        if (!$apiKey) {
            $this->command->error('ERRO: TMDB_API_KEY não encontrada no arquivo .env');
            return;
        }

        // 2. Loop para baixar várias páginas (Aqui baixamos 5 páginas = 100 filmes)
        // Se quiser mais filmes para testar melhor a recomendação, mude o 5 para 10 ou 20.
        for ($i = 1; $i <= 5; $i++) {

            $this->command->info("Baixando filmes populares - Página $i...");

            // Faz a requisição para a API do TMDb
            $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
                'api_key' => $apiKey,
                'language' => 'pt-BR', // Importante: Traz títulos e sinopses em Português
                'page' => $i
            ]);

            if ($response->successful()) {
                $movies = $response->json()['results'];

                foreach ($movies as $movieData) {
                    // O updateOrCreate evita duplicatas: se o ID do TMDb já existir, ele só atualiza.
                    $movie = Movie::updateOrCreate(
                        ['tmdb_id' => $movieData['id']], // Chave de busca
                        [
                            'title' => $movieData['title'],
                            'overview' => $movieData['overview'] ?? '', // Se vier vazio, salva string vazia
                            'poster_path' => $movieData['poster_path'],
                            'release_date' => $movieData['release_date'] ?? null,
                            'vote_average' => $movieData['vote_average'] ?? 0,
                        ]
                    );

                    // Lógica de Gêneros
                    if (isset($movieData['genre_ids']) && is_array($movieData['genre_ids'])) {

                        // Quais são os IDs internos desses gêneros.
                        // Ex: "Quem é o tmdb_id 28?" -> O banco responde: "É o ID 1 (Ação)"
                        $localGenreIds = Genre::whereIn('tmdb_id', $movieData['genre_ids'])
                            ->pluck('id');

                        // Criar o vínculo na tabela pivô 'genre_movie'
                        // O syncWithoutDetaching garante que não vamos apagar vínculos se rodarmos o seed de novo.
                        $movie->genres()->syncWithoutDetaching($localGenreIds);
                    }
                }
            } else {
                $this->command->error("Erro ao baixar página $i. Código: " . $response->status());
            }
        }

        $this->command->info('Processo finalizado! Filmes e gêneros vinculados.');
    }
}
