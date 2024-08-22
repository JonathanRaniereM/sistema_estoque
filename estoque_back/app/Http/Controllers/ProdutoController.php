<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    // GET /produtos
    public function index()
    {
        return Produto::all();
    }

    // POST /produtos
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'valor' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'quantidade' => 'required|numeric'
        ]);

        try {
            $produto = Produto::create($request->all());
            return response()->json($produto, 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar produto: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao processar a requisição'], 500);
        }

    }

    // GET /produtos/{produto}
    public function show(Produto $produto)
    {
        return $produto;
    }

    // PUT/PATCH /produtos/{produto}
    public function update(Request $request, Produto $produto)
    {
        $request->validate([
            'nome' => 'required',
            'valor' => 'required|numeric',
            'categoria_id' => 'exists:categorias,id',
            'quantidade' => 'required|numeric'
        ]);

        $produto->update($request->all());
        return response()->json($produto, 200);
    }

    // DELETE /produtos/{produto}
    public function destroy(Produto $produto)
    {
        $produto->delete();
        return response()->json(null, 204);
    }
}
