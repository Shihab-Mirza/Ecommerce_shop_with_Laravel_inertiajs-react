<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition()
    {
        return [
            'product_code' => $this->faker->unique()->numerify('#####'), // e.g., "PROD-12345"
            'name' => $this->faker->words(3, true), // e.g., "Wireless Bluetooth Earbuds"
            'category_id' => Category::factory(),
            'subcategory_id' => Subcategory::factory(),
            'brand_id' => Brand::factory(),
            'price' => $this->faker->randomFloat(2, 10, 1000), // Between $10 and $1000
            'quantity' => $this->faker->numberBetween(0, 100), // 0-100 units
            'description' => $this->faker->text(200), // Limits to 500 characters,
            'is_featured' => $this->faker->randomElement(['yes', 'no']),
            'image' => $this->faker->imageUrl(640, 480, 'products'), // Fake image URL
            // Specifications (optional)
            'spec_name_1' => 'Warranty',
            'spec_detail_1' => $this->faker->randomElement(['1 year', '2 years', '6 months']),
            'spec_name_2' => 'Color',
            'spec_detail_2' => $this->faker->colorName(),
            'spec_name_3' => 'Material',
            'spec_detail_3' => $this->faker->randomElement(['Plastic', 'Metal', 'Fabric']),
            // Add more specs as needed (up to 15), or leave them null
        ];
    }
}
