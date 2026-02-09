<?php

namespace Database\Seeders;

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

        // 500 páginas é bastante coisa! (10.000 filmes). 
        // Se der erro de tempo de execução, você pode diminuir ou rodar em blocos.
        $totalPages = 500; 

        $this->command->info("Iniciando a importação de $totalPages páginas...");

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
                    
                    // TRATAMENTO DA DATA: Se estiver vazia ou não existir, vira NULL
                    $releaseDate = !empty($data['release_date']) ? $data['release_date'] : null;

                    try {
                        $movie = Movie::updateOrCreate(
                            ['tmdb_id' => $data['id']],
                            [
                                'title'         => $data['title'],
                                'overview'      => $data['overview'] ?? '',
                                'poster_path'   => $data['poster_path'] ?? null,
                                'release_date'  => $releaseDate, // Agora garantido como data ou null
                                'vote_average'  => $data['vote_average'] ?? 0,
                            ]
                        );

                        if (isset($data['genre_ids']) && is_array($data['genre_ids'])) {
                            $localGenreIds = Genre::whereIn('tmdb_id', $data['genre_ids'])
                                ->pluck('id');
                            $movie->genres()->syncWithoutDetaching($localGenreIds);
                        }
                    } catch (\Exception $e) {
                        $this->command->warn("Erro ao salvar filme {$data['title']}: " . $e->getMessage());
                        continue;
                    }
                }
            } else {
                $this->command->error("Erro na página $i. Status: " . $response->status());
                sleep(1); 
            }
        }

        $this->command->info('Processo finalizado!');
    }
}