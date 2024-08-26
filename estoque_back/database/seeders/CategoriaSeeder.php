<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    public function run()
    {
        $categorias = [
            ['nome' => 'Computador', 'codigo' => 'COMP', 'icone' => 'Computador', 'descricao' => 'Produtos voltados para o processamento de dados, incluindo desktops, laptops e estações de trabalho.'],
            ['nome' => 'Monitor', 'codigo' => 'MONI', 'icone' => 'Monitor', 'descricao' => 'Dispositivos de saída que exibem informações em forma gráfica, essenciais para o uso de computadores.'],
            ['nome' => 'Smartphone (Android)', 'codigo' => 'SMA', 'icone' => 'Smartphone (Android)', 'descricao' => 'Variedade de smartphones equipados com o sistema operacional Android, conhecidos por sua flexibilidade e customização.'],
            ['nome' => 'Iphone (IOS)', 'codigo' => 'IPH', 'icone' => 'Iphone (IOS)', 'descricao' => 'Linha de smartphones premium da Apple, que rodam o sistema operacional iOS, conhecidos pela segurança e integração com outros produtos Apple.'],
            ['nome' => 'Roteador', 'codigo' => 'ROTE', 'icone' => 'Roteador', 'descricao' => 'Dispositivos que fornecem acesso à Internet ou a redes privadas, essenciais para conectar diferentes dispositivos em rede.'],
            ['nome' => 'Impressora', 'codigo' => 'IMP', 'icone' => 'Impressora', 'descricao' => 'Equipamentos para impressão de documentos e imagens, variando entre modelos jato de tinta, laser e 3D.']
        ];


        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
