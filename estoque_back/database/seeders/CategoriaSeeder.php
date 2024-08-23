<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categorias = [
            [
                'nome' => 'Eletrônicos',
                'codigo' => 'ELE',
                'icone' => 'icon-eletronicos.png',
                'descricao' => 'Produtos eletrônicos em geral',
            ],
            [
                'nome' => 'Livros',
                'codigo' => 'LIV',
                'icone' => 'icon-livros.png',
                'descricao' => 'Livros de diversos gêneros',
            ],
            [
                'nome' => 'Roupas',
                'codigo' => 'ROP',
                'icone' => 'icon-roupas.png',
                'descricao' => 'Roupas masculinas, femininas e infantis',
            ],
        ];

        foreach ($categorias as $categoriaData) {
            Categoria::create($categoriaData);
        }
    }
}
