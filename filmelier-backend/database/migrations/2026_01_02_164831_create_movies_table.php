<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary(); // ID do TMDb
            $table->string('title');
            $table->jsonb('genre_ids')->nullable(); // Guardará [28, 12, 16]
            $table->text('overview')->nullable();
            $table->string('poster_path')->nullable();
            $table->float('vote_average')->default(0);
            $table->date('release_date')->nullable();
            $table->timestamps();
        });

        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX movies_title_trgm_idx ON movies USING gin (title gin_trgm_ops)');
        DB::statement('CREATE INDEX movies_genre_ids_gin_idx ON movies USING gin (genre_ids)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
