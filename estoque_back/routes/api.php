<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\VendaController;

// Rotas para Produtos
Route::apiResource('produtos', ProdutoController::class);

// Rotas para Categorias
Route::apiResource('categorias', CategoriaController::class);
Route::post('/categorias_post', [CategoriaController::class, 'store']);
Route::get('/teste-venda', [VendaController::class, 'testeVenda']);

// Rotas para Vendas
Route::apiResource('vendas', VendaController::class);
