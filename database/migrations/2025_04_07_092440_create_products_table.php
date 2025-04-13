<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('product_code')->unique();
            $table->string('name');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('subcategory_id')->constrained()->onDelete('cascade')->nullable();
            $table->foreignId('brand_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 8, 2);
            $table->integer('quantity')->default(0);
            $table->string('description')->nullable();
            $table->string('is_featured')->default('no');
            $table->string('is_special_offer')->default('no');
            $table->string('is_offered_product')->default('no');

            $table->string('image')->nullable();

            $table->string('spec_name_1')->nullable();
            $table->string('spec_detail_1')->nullable();
            $table->string('spec_name_2')->nullable();
            $table->string('spec_detail_2')->nullable();
            $table->string('spec_name_3')->nullable();
            $table->string('spec_detail_3')->nullable();
            $table->string('spec_name_4')->nullable();
            $table->string('spec_detail_4')->nullable();
            $table->string('spec_name_5')->nullable();
            $table->string('spec_detail_5')->nullable();
            $table->string('spec_name_6')->nullable();
            $table->string('spec_detail_6')->nullable();
            $table->string('spec_name_7')->nullable();
            $table->string('spec_detail_7')->nullable();
            $table->string('spec_name_8')->nullable();
            $table->string('spec_detail_8')->nullable();
            $table->string('spec_name_9')->nullable();
            $table->string('spec_detail_9')->nullable();
            $table->string('spec_name_10')->nullable();
            $table->string('spec_detail_10')->nullable();
            $table->string('spec_name_11')->nullable();
            $table->string('spec_detail_11')->nullable();
            $table->string('spec_name_12')->nullable();
            $table->string('spec_detail_12')->nullable();
            $table->string('spec_name_13')->nullable();
            $table->string('spec_detail_13')->nullable();
            $table->string('spec_name_14')->nullable();
            $table->string('spec_detail_14')->nullable();
            $table->string('spec_name_15')->nullable();
            $table->string('spec_detail_15')->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
