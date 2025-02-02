<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comentario', function (Blueprint $table) {
            $table->id(); // Crea la columna 'id' como primary key
            $table->string('contenido'); // Crea la columna 'contenido' como string
            $table->integer('calificacion')->nullable(); // Crea la columna 'calificacion' como entero y permite valores nulos
            $table->timestamp('fecha')->useCurrent(); // Crea la columna 'fecha' con valor actual por defecto
            $table->unsignedBigInteger('usuario_id'); // Llave foránea a usuarios
            $table->unsignedBigInteger('producto_id'); // Llave foránea a productos

            // Relaciones
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('producto_id')->references('id')->on('products')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentario');
    }
};