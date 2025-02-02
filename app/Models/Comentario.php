<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $table = 'comentario'; // Nombre exacto de la tabla

    protected $fillable = [
        'contenido',
        'calificacion',
        'fecha',
        'usuario_id',
        'producto_id'
    ];

    // Relación con User (modelo estándar de Laravel)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Relación con Product (nombre del modelo en inglés)
    public function producto()
    {
        return $this->belongsTo(Product::class, 'producto_id');
    }
}