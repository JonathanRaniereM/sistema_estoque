<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VendaController;

// Rotas específicas primeiro
Route::get('/teste-venda', [VendaController::class, 'testeVenda']);
Route::apiResource('vendas', VendaController::class);


Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

