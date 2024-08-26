<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProdutoVenda extends Model
{
    use HasFactory;

    protected $table = 'produto_venda';

    protected $fillable = ['produto_id', 'venda_id', 'quantidade'];
}
