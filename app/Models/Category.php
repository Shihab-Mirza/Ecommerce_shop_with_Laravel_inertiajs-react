<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Brand;
use App\Models\Subcategory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = ['name'];
    public function subcategory()
    {
        return $this->hasMany(Subcategory::class);
    }
    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function brands()
    {
        return $this->hasMany(Brand::class);
    }



}
