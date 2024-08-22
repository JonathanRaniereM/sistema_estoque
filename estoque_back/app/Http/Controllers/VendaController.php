<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Venda;
use Illuminate\Http\Request;

class VendaController extends Controller
{
    public function index()
    {
        return Venda::with('produtos')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'produtos' => 'required|array',
            'produtos.*.id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|numeric|min:1'
        ]);

        // Verificar estoque e calcular totais
        $total = 0;
        $items = collect($request->produtos);
        foreach ($items as $item) {
            $produto = Produto::findOrFail($item['id']);
            if ($produto->quantidade < $item['quantidade']) {
                return response()->json(['error' => 'Quantidade insuficiente para o produto ' . $produto->nome], 400);
            }
            $total += $produto->valor * $item['quantidade'];
            $produto->quantidade -= $item['quantidade']; // decrementa o estoque
            $produto->save();
        }

        $venda = new Venda([
            'quantidade_total' => $items->sum('quantidade'),
            'valor_total' => $total
        ]);
        $venda->save();

        // associar produtos à venda
        $venda->produtos()->attach($items->pluck('quantidade', 'id'));

        return response()->json($venda, 201);
    }

    public function show(Venda $venda)
    {
        return $venda->load('produtos');
    }

    public function update(Request $request, Venda $venda)
    {
        // Lógica para atualizar vendas pode ser complexa devido à necessidade de ajustar estoques
        // Sugerido implementar apenas se necessário
        return response()->json(['message' => 'Update not implemented'], 501);
    }

    public function destroy(Venda $venda)
    {
        // A destruição de vendas deve reajustar os estoques dos produtos vendidos
        // Sugerido implementar cuidadosamente com lógicas de restauração de estoque
        return response()->json(['message' => 'Delete not implemented'], 501);
    }
}
