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



// Rotas para Vendas
Route::apiResource('vendas', VendaController::class);
Route::post('vendas/{venda}/produtos', [VendaController::class, 'addProduto']);
Route::delete('vendas/{venda}/produtos/{produto}', [VendaController::class, 'removeProduto']);
Route::get('vendas-detalhadas', [VendaController::class, 'getVendasDetalhadas']);
Route::put('vendas/{venda}', [VendaController::class, 'update']);
Route::get('vendas/{venda}', [VendaController::class, 'show']);
Route::get('produtos', [ProdutoController::class, 'index']);

