<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Genre;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $apiKey = env('TMDB_API_KEY');

        $response = Http::get("https://api.themoviedb.org/3/genre/movie/list", [
            'api_key' => $apiKey,
            'language' => 'pt-BR',
        ]);

        if ($response->successful()) {
            $genres = $response->json()['genres'];

            foreach ($genres as $genreData) {
                Genre::updateOrCreate(
                    ['tmdb_id' => $genreData['id']], // Procura por este ID
                    ['name' => $genreData['name']]   // Salva o nome (ex: Ação)
                );
            }
            $this->command->info('Gêneros populados com sucesso!');
        } else {
            $this->command->error('Falha ao conectar com a TMDb API.');
        }
    }
}
