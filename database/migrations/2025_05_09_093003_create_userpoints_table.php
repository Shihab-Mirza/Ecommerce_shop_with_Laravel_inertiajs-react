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
        Schema::create('userpoint_rules', function (Blueprint $table) {
            $table->id();
           $table->bigInteger('minimum_taka_spent')->nullable();
            $table->bigInteger('points_per_minimum_taka')->nullable();
            $table->bigInteger('minimum_points_spent')->nullable();
            $table->bigInteger('discount_taka_for_points')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('userpoints');
    }
};
