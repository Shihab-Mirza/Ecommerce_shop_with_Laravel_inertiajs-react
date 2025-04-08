<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    public function definition()
    {
        return [
            'brand_name' => $this->faker->company(), // e.g., "Samsung", "Nike"
            'subcategory_id' => Subcategory::factory(), // Creates a subcategory
            'category_id' => function (array $attributes) {
                return Subcategory::find($attributes['subcategory_id'])->category_id;
            }, // Matches category of subcategory
        ];
    }
}
