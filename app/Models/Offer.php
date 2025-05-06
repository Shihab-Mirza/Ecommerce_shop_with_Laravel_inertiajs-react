<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $primaryKey = 'offer_id';

    protected $fillable = [
        'product_id',
        'discount_type',
        'offer_price',
        'discount_value',
        'start_date',
        'end_date',
        'is_active',
    ];


    protected $casts = [
        'is_active' => 'string', // Ensure is_active is treated as a string
        'start_date' => 'date',
        'end_date' => 'date',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    // Check if offer is currently valid
    public function isValid()
    {
        $now = now();
        return $this->is_active &&
               $this->start_date <= $now &&
               $this->end_date >= $now;
    }
}
