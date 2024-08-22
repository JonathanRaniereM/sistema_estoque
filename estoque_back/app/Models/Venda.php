<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venda extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantidade_total', 'valor_total'
    ];

    // Relação com Produtos
    public function produtos()
    {
        return $this->belongsToMany(Produto::class)->withPivot('quantidade');
    }
}
