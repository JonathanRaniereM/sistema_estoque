<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProdutoController extends Controller
{

    public function index()
    {
        return Produto::with('categoria')->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required',
            'valor' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'quantidade' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validação para a imagem
        ]);

        try {

            $produto = new Produto($request->except('foto'));

            if ($request->hasFile('foto')) {
                $imageName = time().'.'.$request->foto->getClientOriginalExtension();
                $filePath = $request->foto->storeAs('uploads/produtos', $imageName, 'public');
                $produto->foto = $filePath;
            }


            $produto->save();

            return response()->json($produto, 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar produto: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao processar a requisição'], 500);
        }
    }



    public function show(Produto $produto)
    {
        return $produto;
    }


    public function update(Request $request, Produto $produto)
    {
        $request->validate([
            'nome' => 'required',
            'valor' => 'required|numeric',
            'categoria_id' => 'exists:categorias,id',
            'quantidade' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validação para a imagem
        ]);

        try {
            $produto->fill($request->except('foto'));

            if ($request->hasFile('foto')) {
                $imageName = time().'.'.$request->foto->getClientOriginalExtension();
                $filePath = $request->foto->storeAs('uploads/produtos', $imageName, 'public'); // Guardar na pasta public e salvar o caminho correto
                $produto->foto = $filePath;
            }

            $produto->save();

            return response()->json($produto, 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar produto: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao processar a requisição'], 500);
        }
    }


    public function destroy(Produto $produto)
    {
        try {

            if ($produto->foto && file_exists(public_path($produto->foto))) {
                unlink(public_path($produto->foto));
            }

            $produto->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir produto: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao processar a requisição'], 500);
        }
    }

}
