<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Seed some categories, subcategories, and brands first
        $categories = Category::factory()->count(10)->create(); // 10 categories
        $subcategories = Subcategory::factory()->count(30)->create(); // 30 subcategories
        $brands = Brand::factory()->count(50)->create(); // 50 brands

        // Seed 1000 products
        Product::factory()
            ->count(1000)
            ->create([
                'category_id' => function () use ($categories) {
                    return $categories->random()->id;
                },
                'subcategory_id' => function () use ($subcategories) {
                    return $subcategories->random()->id;
                },
                'brand_id' => function () use ($brands) {
                    return $brands->random()->id;
                },
            ]);
    }
}
