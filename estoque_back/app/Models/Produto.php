<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome', 'foto', 'valor', 'categoria_id', 'quantidade'
    ];

    // Relação com Categoria
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relação com Vendas
    public function vendas()
    {
        return $this->belongsToMany(Venda::class)->withPivot('quantidade');
    }
}
