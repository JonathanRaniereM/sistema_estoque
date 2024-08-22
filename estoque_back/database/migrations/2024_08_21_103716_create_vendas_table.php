<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVendasTable extends Migration
{
    public function up()
    {
        Schema::create('vendas', function (Blueprint $table) {
            $table->id();
            $table->integer('quantidade_total');
            $table->decimal('valor_total', 10, 2);
            $table->timestamps();
        });

        // Tabela de relação entre Vendas e Produtos
        Schema::create('produto_venda', function (Blueprint $table) {
            $table->foreignId('venda_id')->constrained('vendas');
            $table->foreignId('produto_id')->constrained('produtos');
            $table->integer('quantidade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('produto_venda');
        Schema::dropIfExists('vendas');
    }
}
