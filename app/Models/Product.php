<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'product_code',
        'name',
        'category_id',
        'brand_id',
        'subcategory_id',
        'price',
        'quantity',
        'description',
        'is_featured',
        'is_special_offer',
        'is_offered_product',
        'image',
        'spec_name_1',
        'spec_detail_1',
        'spec_name_2',
        'spec_detail_2',
        'spec_name_3',
        'spec_detail_3',
        'spec_name_4',
        'spec_detail_4',
        'spec_name_5',
        'spec_detail_5',
        'spec_name_6',
        'spec_detail_6',
        'spec_name_7',
        'spec_detail_7',
        'spec_name_8',
        'spec_detail_8',
        'spec_name_9',
        'spec_detail_9',
        'spec_name_10',
        'spec_detail_10',
        'spec_name_11',
        'spec_detail_11',
        'spec_name_12',
        'spec_detail_12',
        'spec_name_13',
        'spec_detail_13',
        'spec_name_14',
        'spec_detail_14',
        'spec_name_15',
        'spec_detail_15',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class); }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }



    public function offer()
    {
        return $this->hasOne(Offer::class, 'product_id', 'id');
    }


    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
