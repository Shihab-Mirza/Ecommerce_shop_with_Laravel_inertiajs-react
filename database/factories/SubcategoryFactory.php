<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubcategoryFactory extends Factory
{
    public function definition()
    {
        return [
            'sub_category_name' => $this->faker->words(2, true), // e.g., "Smart Phones"
            'category_id' => Category::factory(), // Creates a category if not provided
        ];
    }
}
