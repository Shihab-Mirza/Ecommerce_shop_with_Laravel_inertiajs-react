<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = ['sub_category_name',
'category_id' , 'icon' ,'show_sub_category_icon'];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function brands()
    {
        return $this->hasMany(Brand::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }



}
