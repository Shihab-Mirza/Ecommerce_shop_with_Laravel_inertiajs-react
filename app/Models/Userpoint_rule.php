<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Userpoint_rule extends Model
{


    protected $fillable = [
        'minimum_taka_spent',
        'points_per_minimum_taka',
        'minimum_points_spent',
        'discount_taka_for_points',
    ];
}
