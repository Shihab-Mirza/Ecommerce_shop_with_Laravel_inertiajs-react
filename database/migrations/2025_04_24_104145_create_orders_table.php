<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('order_id')->unique();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->double('amount')->nullable();
            $table->text('address')->nullable();
            $table->string('status', )->nullable();
            $table->string('transaction_id', 255)->nullable();
            $table->string('currency')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('zip')->nullable();
            $table->enum('order_type', ['cash on delivery', 'advance payment'])->nullable();
            $table->enum('delivery_status', ['not delivered', 'delivered'])->default('not delivered')->nullable();
            $table->bigInteger('delivery_otp')->nullable()->unqiue();
            $table->timestamp('expires_at');
            $table->bigInteger('used_points')->nullable();
            $table->string('used_Vouchers')->nullable();
            $table->bigInteger('amount_discounted_on_points')->nullable();
            $table->bigInteger('amount_discounted_on_Vouchers')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('restrict');
            $table->string('order_token')->nullable()->unique();
            $table->timestamps();
            $table->charset = 'utf8';
            $table->collation = 'utf8_unicode_ci';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
