<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// Add login route to prevent error
Route::get('/login', function () {
    return response()->json(['message' => 'Please use API for authentication'], 401);
})->name('login');
