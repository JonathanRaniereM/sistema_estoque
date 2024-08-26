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
            ['nome' => 'Laptop XPTO', 'foto' => 'laptop_xpto.jpg', 'valor' => 2500.00, 'categoria_id' => 17, 'quantidade' => 25],
            ['nome' => 'Laptop Gamer Turbo', 'foto' => 'laptop_gamer_turbo.jpg', 'valor' => 4500.00, 'categoria_id' => 17, 'quantidade' => 17],
            ['nome' => 'Monitor 4K', 'foto' => 'monitor_4k.jpg', 'valor' => 1200.00, 'categoria_id' => 13, 'quantidade' => 15],
            ['nome' => 'Monitor Curvo 32"', 'foto' => 'monitor_curvo.jpg', 'valor' => 1800.00, 'categoria_id' => 13, 'quantidade' => 28],
            ['nome' => 'Smartphone XY', 'foto' => 'smartphone_xy.jpg', 'valor' => 1500.00, 'categoria_id' => 14, 'quantidade' => 32],
            ['nome' => 'Smartphone Pro Max', 'foto' => 'smartphone_pro_max.jpg', 'valor' => 2800.00, 'categoria_id' => 14, 'quantidade' => 45],
            ['nome' => 'iPhone 12', 'foto' => 'iphone_12.jpg', 'valor' => 5000.00, 'categoria_id' => 15, 'quantidade' => 35],
            ['nome' => 'iPhone 13 Mini', 'foto' => 'iphone_13_mini.jpg', 'valor' => 5500.00, 'categoria_id' => 15, 'quantidade' => 23],
            ['nome' => 'Roteador MaxSpeed', 'foto' => 'roteador_maxspeed.jpg', 'valor' => 300.00, 'categoria_id' => 16, 'quantidade' => 25],
            ['nome' => 'Roteador UltraFast', 'foto' => 'roteador_ultrafast.jpg', 'valor' => 450.00, 'categoria_id' => 16, 'quantidade' => 75],
            ['nome' => 'Impressora 3D', 'foto' => 'impressora_3d.jpg', 'valor' => 2200.00, 'categoria_id' => 17, 'quantidade' => 23],
            ['nome' => 'Impressora Laser Colorida', 'foto' => 'impressora_laser.jpg', 'valor' => 2600.00, 'categoria_id' => 17, 'quantidade' => 32]
        ];


        foreach ($produtos as $produtoData) {
            Produto::create($produtoData);
        }
    }
}
