<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\ImageUploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Image upload endpoint (PUBLIC)
Route::post('/upload/candidate-photo', [ImageUploadController::class, 'uploadCandidatePhoto']);

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Poll routes (PUBLIC - No authentication required for viewing and voting)
Route::get('/polls', [PollController::class, 'index']);
Route::get('/polls/{id}', [PollController::class, 'show']);
Route::post('/polls/{id}/vote', [PollController::class, 'vote']);
Route::get('/polls/{id}/results', [PollController::class, 'results']);

// Old candidate routes (keeping for backward compatibility)
Route::get('/candidates', [CandidateController::class, 'index']);
Route::post('/vote', [VoteController::class, 'store']);
Route::get('/results', [VoteController::class, 'results']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Poll management (requires authentication)
    Route::post('/polls', [PollController::class, 'store']); // CREATE POLL - PROTECTED
    Route::put('/polls/{id}/start', [PollController::class, 'start']); // START POLL - PROTECTED
    Route::put('/polls/{id}/stop', [PollController::class, 'stop']);
    Route::delete('/polls/{id}', [PollController::class, 'destroy']);

    // Candidate management
    Route::post('/candidates', [CandidateController::class, 'store']);
    Route::put('/candidates/{candidate}', [CandidateController::class, 'update']);
    Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy']);
    Route::get('/candidates/{candidate}', [CandidateController::class, 'show']);
});
