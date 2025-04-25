<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'order_id',
        'name',
        'email',
        'phone',
        'amount',
        'address',
        'status',
        'transaction_id',
        'currency',
    ];
    public $timestamps = false; // Disable automatic timestamps
    protected $casts = [
        'amount' => 'double',
    ];
}
