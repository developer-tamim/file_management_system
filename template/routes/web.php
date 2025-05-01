<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Authentication routes (if using Laravel Breeze/Jetstream)
require __DIR__.'/auth.php';

// SPA route - all routes will be handled by Vue Router
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
