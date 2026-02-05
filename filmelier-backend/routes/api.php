<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\RecommendationController;

// Rotas Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas Protegidas (Exigem Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Busca de Filmes (Proxy TMDb)
    // Lembre-se de ter criado o MovieController com o método search
    Route::get('/search', [MovieController::class, 'search']);
    // Biblioteca
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library', [LibraryController::class, 'store']);
    Route::put('/library/{movie}', [LibraryController::class, 'update']);
    Route::delete('/library/{movie}', [LibraryController::class, 'destroy']);

    // Recomendação
    Route::post('/recommend', [RecommendationController::class, 'generate']);
});