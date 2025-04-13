<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id('offer_id');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->enum('discount_type', ['unlimited', 'fixed']);
            $table->decimal('offer_price', 8, 2);
            $table->decimal('discount_value', 8, 2);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('is_active')->default('no');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
