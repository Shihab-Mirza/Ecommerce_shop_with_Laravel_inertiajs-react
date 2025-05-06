<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $fillable = [
        'order_id',
        'user_id',
        'name',
        'email',
        'phone',
        'amount',
        'address',
        'status',
        'transaction_id',
        'currency',
    ];
    public $timestamps = false;
    protected $casts = [
        'amount' => 'double',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
