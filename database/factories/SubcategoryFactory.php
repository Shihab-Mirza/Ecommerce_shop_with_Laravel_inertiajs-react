<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubcategoryFactory extends Factory
{
    public function definition()
    {
        return [
            'sub_category_name' => $this->faker->word(),
            'category_id' => Category::factory(),
        ];
    }

    // Custom state to set specific subcategory name and category
    public function forCategory($categoryId, $subcategoryName)
    {
        return $this->state([
            'sub_category_name' => $subcategoryName,
            'category_id' => $categoryId,
        ]);
    }
}
