<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Models\Venda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        try {
            DB::transaction(function () use ($request) {
                // Cria a venda
                $venda = new Venda();
                $venda->save();

                // Itera sobre cada produto para verificar o estoque, atualizar o estoque, e associar à venda
                foreach ($request->produtos as $item) {
                    $produto = Produto::findOrFail($item['id']);

                    // Verifica se o estoque está zerado
                    if ($produto->quantidade <= 0) {
                        throw new \Exception('Produto ' . $produto->nome . ' está fora de estoque.');
                    }

                    // Verifica se a quantidade solicitada é maior que o estoque disponível
                    if ($produto->quantidade < $item['quantidade']) {
                        throw new \Exception('Quantidade insuficiente para o produto ' . $produto->nome);
                    }

                    // Atualiza o estoque do produto
                    $produto->quantidade -= $item['quantidade'];
                    $produto->save();

                    // Associa o produto à venda na tabela pivô com a quantidade vendida
                    $venda->produtos()->attach($produto->id, ['quantidade' => $item['quantidade']]);
                }
            });

            return response()->json(['message' => 'Venda realizada com sucesso'], 201);

        } catch (\Exception $e) {
            // Retorna uma resposta de erro se alguma exceção for lançada
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show(Venda $venda)
    {
        return $venda->load('produtos');
    }

    public function update(Request $request, Venda $venda)
    {
        // Lógica para atualizar vendas pode ser complexa devido à necessidade de ajustar estoques
        return response()->json(['message' => 'Update not implemented'], 501);
    }

    public function destroy(Venda $venda)
    {
        // A destruição de vendas deve reajustar os estoques dos produtos vendidos
        return response()->json(['message' => 'Delete not implemented'], 501);
    }

    // Método de teste para simular uma venda
    public function testeVenda()
    {
        // Simulando a venda de produtos
        $vendaData = [
            'produtos' => [
                ['id' => 3, 'quantidade' => 499], // Tentando vender 49 unidades do Produto com ID 2
            ]
        ];

        // Executando o método store para criar a venda
        $response = $this->store(new Request($vendaData));

        // Verificando o estoque do produto
        $produto2 = Produto::find(2);

        return $response;
    }
}
