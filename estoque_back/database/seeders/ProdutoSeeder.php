<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;

class ProdutoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $produtos = [
            [
                'nome' => 'Produto 1',
                'foto' => 'foto_produto_1.jpg',
                'valor' => 10.00,
                'categoria_id' => 1, // Assumindo que você já tenha uma categoria com ID 1
                'quantidade' => 100
            ],
            [
                'nome' => 'Produto 2',
                'foto' => 'foto_produto_2.jpg',
                'valor' => 20.00,
                'categoria_id' => 1,
                'quantidade' => 50
            ],
            [
                'nome' => 'Produto 3',
                'foto' => 'foto_produto_3.jpg',
                'valor' => 30.00,
                'categoria_id' => 2, // Assumindo que você tenha uma categoria com ID 2
                'quantidade' => 200
            ],
        ];

        foreach ($produtos as $produtoData) {
            Produto::create($produtoData);
        }
    }
}
