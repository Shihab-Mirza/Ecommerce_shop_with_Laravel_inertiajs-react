<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Userpoint extends Model
{
     protected $fillable = [
        'user_id',
        'user_point',
    ];
     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
