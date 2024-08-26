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

    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            return asset('storage/' . str_replace('public/', '', $this->foto));
        }

        return null;
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function vendas()
    {
        return $this->belongsToMany(Venda::class)->withPivot('quantidade');
    }
}
