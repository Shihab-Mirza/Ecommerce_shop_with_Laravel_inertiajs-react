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
    ];


    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }


}
