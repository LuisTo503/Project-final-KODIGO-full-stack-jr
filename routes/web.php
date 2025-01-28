<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\StatisticsController;

Route::get('/{path?}', function () {
    return view('welcome');
})->where('path', '^(?!api).*');

// Rutas de autenticación
Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');

// Eliminar cuenta del usuario autenticado
Route::delete('/user/delete', [UserController::class, 'destroyAuthenticatedUser'])->middleware('auth');

// Administrar usuarios
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('admin/users', AdminUserController::class);
});

// Editar comentarios
Route::middleware('auth')->group(function () {
    Route::resource('comments', CommentController::class)->only(['edit', 'update']);
});

// Estadísticas de registros
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('admin/statistics', [StatisticsController::class, 'index']);
});

?>

