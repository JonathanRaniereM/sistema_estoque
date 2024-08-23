<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venda extends Model
{
    use HasFactory;

    // Relação com Produtos
    public function produtos()
    {
        return $this->belongsToMany(Produto::class)->withPivot('quantidade')->withTimestamps();
    }
}
