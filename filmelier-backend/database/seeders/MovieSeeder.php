<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Movie;

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

        // 500 páginas = 10.000 filmes.
        $totalPages = 500;

        $this->command->info("Iniciando a importação de $totalPages páginas diretamente para JSONB...");

        for ($i = 1; $i <= $totalPages; $i++) {

            $this->command->info("Baixando Página $i...");

            $response = Http::get("https://api.themoviedb.org/3/movie/popular", [
                'api_key' => $apiKey,
                'language' => 'pt-BR',
                'page' => $i
            ]);

            if ($response->successful()) {
                $moviesData = $response->json()['results'];

                foreach ($moviesData as $data) {
                    
                    $releaseDate = !empty($data['release_date']) ? $data['release_date'] : null;

                    try {
                        // Agora usamos 'id' (TMDb) como nossa chave primária real
                        Movie::updateOrCreate(
                            ['id' => $data['id']], 
                            [
                                'title'        => $data['title'],
                                'overview'     => $data['overview'] ?? '',
                                'poster_path'  => $data['poster_path'] ?? null,
                                'release_date' => $releaseDate,
                                'vote_average' => $data['vote_average'] ?? 0,
                                // Salvamos o array de IDs puro, sem tradução!
                                'genre_ids'    => $data['genre_ids'] ?? [], 
                            ]
                        );
                    } catch (\Exception $e) {
                        $this->command->warn("Erro ao salvar filme {$data['title']}: " . $e->getMessage());
                        continue;
                    }
                }
            } else {
                $this->command->error("Erro na página $i. Status: " . $response->status());
                // Se bater no rate limit do TMDb, dá uma respirada
                sleep(1);
            }
        }

        $this->command->info('Processo finalizado! Seu banco está sincronizado com o TMDb.');
    }
}