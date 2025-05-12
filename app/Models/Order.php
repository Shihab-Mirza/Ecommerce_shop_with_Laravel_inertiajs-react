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
        'country',
        'city',
        'zip',
        'order_token',
       'used_points',
       'used_Vouchers',
       'order_type',
      'delivery_status',
      'delivery_otp',

      'amount_discounted_on_points',
      'amount_discounted_on_vouchers',
    ];
    protected $casts = [
        'amount' => 'double',
        'expires_at' => 'datetime',
    ];
    public function items()
    {
        return $this->hasMany(Orderitem::class, 'order_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
