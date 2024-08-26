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

        $venda = new Venda();
        $venda->save();

        return response()->json($venda, 201);
    }

    public function addProduto(Request $request, $vendaId)
    {
        $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|numeric|min:1',
        ]);

        try {
            DB::transaction(function () use ($request, $vendaId) {
                $produto = Produto::findOrFail($request->produto_id);

                if ($produto->quantidade < $request->quantidade) {
                    throw new \Exception('Quantidade insuficiente para o produto ' . $produto->nome . ".\nQuantidade disponível: " . $produto->quantidade);
                }

                $venda = Venda::findOrFail($vendaId);
                $produtoVendaExistente = $venda->produtos()->where('produto_id', $produto->id)->first();

                if ($produtoVendaExistente) {
                    $produtoVendaExistente->pivot->quantidade += $request->quantidade;
                    $produto->quantidade -= $request->quantidade;
                } else {
                    $venda->produtos()->attach($produto->id, ['quantidade' => $request->quantidade]);
                    $produto->quantidade -= $request->quantidade;
                }

                $produto->save();
                $venda->push();
            });

            return response()->json(['message' => 'Produto adicionado ou atualizado na venda com sucesso'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function removeProduto(Request $request, $vendaId, $produtoId)
    {
        try {
            DB::transaction(function () use ($vendaId, $produtoId) {
                $venda = Venda::findOrFail($vendaId);
                $produto = $venda->produtos()->findOrFail($produtoId);

                // Aumenta o estoque do produto com a quantidade associada à venda
                $produto->quantidade += $produto->pivot->quantidade;
                $produto->save();

                // Remove o produto da venda
                $venda->produtos()->detach($produtoId);
            });

            return response()->json(['message' => 'Produto removido da venda e estoque atualizado com sucesso'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao remover o produto da venda: ' . $e->getMessage()], 500);
        }
    }




    public function show(Venda $venda)
    {
        return $venda->load('produtos');
    }

    public function getVendasDetalhadas()
    {

        $vendas = Venda::with('produtos')->get()->filter(function ($venda) {
            return $venda->produtos->isNotEmpty();
        });


        $vendasDetalhadas = $vendas->map(function ($venda) {
            $qtdTotal = 0;
            $valorTotal = 0;


            foreach ($venda->produtos as $produto) {
                $qtdTotal += $produto->pivot->quantidade;
                $valorTotal += $produto->pivot->quantidade * $produto->valor;
            }

            return [
                'codVenda' => $venda->id,
                'qtdTotal' => $qtdTotal,
                'valorTotal' => $valorTotal,
            ];
        });

        return response()->json($vendasDetalhadas->values(), 200);
    }



    public function update(Request $request, Venda $venda)
    {
        $request->validate([
            'produtos' => 'required|array|min:1',
            'produtos.*.produto_id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($request, $venda) {
                $produtosAtuais = $venda->produtos()->get();

                // Mapear produtos enviados na requisição
                $produtosNovos = collect($request->produtos);

                // Reajustar estoque para produtos removidos ou com quantidade reduzida
                foreach ($produtosAtuais as $produtoAtual) {
                    $produtoNovo = $produtosNovos->firstWhere('produto_id', $produtoAtual->id);

                    if ($produtoNovo) {
                        $diferencaQuantidade = $produtoNovo['quantidade'] - $produtoAtual->pivot->quantidade;

                        if ($diferencaQuantidade > 0) {
                            // Verifica se há estoque suficiente
                            if ($produtoAtual->quantidade < $diferencaQuantidade) {
                                throw new \Exception('Estoque insuficiente para o produto: ' . $produtoAtual->nome.".\nQuantidade disponível: " . $produtoAtual->quantidade);
                            }
                            // Reduz o estoque
                            $produtoAtual->quantidade -= $diferencaQuantidade;
                        } else {
                            // Aumenta o estoque
                            $produtoAtual->quantidade += abs($diferencaQuantidade);
                        }
                        $produtoAtual->save();
                    } else {
                        // Produto removido da venda, devolver quantidade ao estoque
                        $produtoAtual->quantidade += $produtoAtual->pivot->quantidade;
                        $produtoAtual->save();
                        $venda->produtos()->detach($produtoAtual->id);
                    }
                }

                // Adicionar novos produtos à venda
                foreach ($produtosNovos as $produtoNovo) {
                    $produtoExistente = $produtosAtuais->firstWhere('id', $produtoNovo['produto_id']);

                    if (!$produtoExistente) {
                        $produto = Produto::findOrFail($produtoNovo['produto_id']);

                        if ($produto->quantidade < $produtoNovo['quantidade']) {
                            throw new \Exception('Estoque insuficiente para o produto: ' . $produto->nome.".\nQuantidade disponível: " . $produto->quantidade);
                        }

                        // Reduz o estoque
                        $produto->quantidade -= $produtoNovo['quantidade'];
                        $produto->save();

                        // Anexa o novo produto à venda
                        $venda->produtos()->attach($produto->id, ['quantidade' => $produtoNovo['quantidade']]);
                    } else {
                        // Atualiza a quantidade na tabela intermediária
                        $venda->produtos()->updateExistingPivot($produtoExistente->id, ['quantidade' => $produtoNovo['quantidade']]);
                    }
                }
            });

            return response()->json(['message' => 'Venda atualizada com sucesso'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }


    public function destroy(Venda $venda)
    {
        try {
            DB::transaction(function () use ($venda) {
                // Reajusta o estoque dos produtos
                foreach ($venda->produtos as $produto) {
                    // Aumenta o estoque do produto com a quantidade associada à venda
                    $produto->quantidade += $produto->pivot->quantidade;
                    $produto->save();
                }

                // Exclui os registros da tabela intermediária produto_venda
                $venda->produtos()->detach();

                // Exclui a venda
                $venda->delete();
            });

            return response()->json(['message' => 'Venda excluída e estoque reajustado com sucesso'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao excluir a venda: ' . $e->getMessage()], 500);
        }
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
