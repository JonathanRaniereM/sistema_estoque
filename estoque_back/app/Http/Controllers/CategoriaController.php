<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::all();
    }

    public function store(Request $request)
    {
        Log::info('Dados Recebidos: ', $request->all());
        Log::info('Corpo Bruto: ', ['body' => $request->getContent()]);

        $request->validate([
            'nome' => 'required|string|max:255',
            'codigo' => 'required|string|max:255|unique:categorias,codigo',
            'icone' => 'nullable|string|max:255',
            'descricao' => 'nullable|string'
        ]);

        $categoria = Categoria::create($request->all());
        Log::info('Categoria Criada: ', $categoria->toArray());
        return response()->json($categoria, 201);
    }

    public function show(Categoria $categoria)
    {
        return $categoria;
    }

    public function update(Request $request, Categoria $categoria)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'codigo' => 'required|string|max:255|unique:categorias,codigo,' . $categoria->id,
            'icone' => 'nullable|string|max:255',
            'descricao' => 'nullable|string'
        ]);

        $categoria->update($request->all());
        return response()->json($categoria, 200);
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();
        return response()->json(null, 204);
    }
}
