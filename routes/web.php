<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Http\Request;
use App\Http\Controllers\API\FileController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\StorageProviderController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Route::get('/{any}', function () {
//     return view('app');
// })->where('any', '.*');


Route::get('/files', [FileController::class, 'index']);
Route::get('/files/recent', [FileController::class, 'recent']);
Route::get('/files/shared', [FileController::class, 'shared']);
Route::get('/files/favorites', [FileController::class, 'favorites']);
Route::get('/files/{file}', [FileController::class, 'show']);
Route::post('/files', [FileController::class, 'store']);
Route::post('/files/upload', [FileController::class, 'upload']);
Route::put('/files/{file}', [FileController::class, 'update']);
Route::delete('/files/{file}', [FileController::class, 'destroy']);
Route::post('/files/{file}/favorite', [FileController::class, 'toggleFavorite']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

// Storage Providers
Route::get('/storage-providers', [StorageProviderController::class, 'index']);
Route::post('/storage-providers', [StorageProviderController::class, 'store']);
Route::post('/storage-providers/connect', [StorageProviderController::class, 'connect']);

// Profile
Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile', [ProfileController::class, 'update']);
Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
