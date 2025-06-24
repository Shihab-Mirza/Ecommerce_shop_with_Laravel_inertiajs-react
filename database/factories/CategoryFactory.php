<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition()
    {
        $categories = [
            'Laptops',
            'Smartphones',
            'Tablets',
            'Desktops',
            'Accessories',
            'Wearables',
            'Audio',
            'Cameras',
            'Networking'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
        ];
    }
}
