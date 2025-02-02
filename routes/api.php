<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::patch('/users/{id}/info', [UserController::class, 'updateInfo']);
    Route::patch('/users/{id}/password', [UserController::class, 'updatePassword']);
    
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);


    Route::post('comentario', [ComentarioController::class, 'store']);
    Route::get('comentario', [ComentarioController::class, 'index']);
    Route::patch('/comentario/{id}', [ComentarioController::class, 'update']);
});


