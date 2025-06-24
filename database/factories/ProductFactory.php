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
        $models = ['Yoga Pro', 'ThinkPad', 'Galaxy', 'Surface', 'Spectre', 'ZenBook', 'Predator', 'ROG', 'Pixel', 'MateBook'];
        $processors = ['Ryzen 7 8845HS', 'Core i7-13700H', 'Snapdragon 8 Gen 3', 'Core i5-1340P', 'M2 Max', 'Ryzen 5 7640HS'];
        $graphics = ['RTX 3050 6GB', 'GTX 1650 4GB', 'Intel Iris Xe', 'Radeon RX 6700M', 'Apple M2 GPU', 'RTX 4060 8GB'];
        $screenSizes = ['13.3"', '14.5"', '15.6"', '16"', '17.3"', '6.7"', '10.5"'];
        $productTypes = ['Gaming Laptop', 'Ultrabook', 'Smartphone', 'Tablet', 'All-in-One PC', 'Smartwatch', 'Wireless Earbuds'];
        $imagePaths = [
            'products/3942185_gg_20250527_082231.jpg',
            'products/3942185_gg_20250527_082232.jpg',
            'products/3942185_gg_20250527_082233.jpg',
            'products/3942185_gg_20250527_082234.jpg',
            'products/3942185_gg_20250527_082235.jpg',
            'products/3942185_gg_20250527_082236.jpg',
            'products/3942185_gg_20250527_082237.jpg',
            'products/3942185_gg_20250527_082238.jpg',
        ];

        // Fetch related models
        $brand = Brand::inRandomOrder()->first() ?? Brand::factory()->create();
        $subcategory = Subcategory::find($brand->subcategory_id);
        $category = Category::find($brand->category_id);

        // Construct product name
        $productName = sprintf(
            '%s %s %s %s %s %s',
            $brand->brand_name,
            $this->faker->randomElement($models),
            $this->faker->numerify('###'),
            $this->faker->randomElement($processors),
            $this->faker->randomElement($graphics),
            $this->faker->randomElement($screenSizes) . ' ' . $this->faker->randomElement($productTypes)
        );

        return [
            'product_code' => $this->faker->unique()->numerify('#####'),
            'name' => $productName,
            'category_id' => $category->id,
            'subcategory_id' => $subcategory->id,
            'brand_id' => $brand->id,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'quantity' => $this->faker->numberBetween(0, 100),
            'description' => $this->faker->text(200),
            'is_featured' => $this->faker->randomElement(['yes', 'no']),
            'image' => $this->faker->randomElement($imagePaths), // Randomly select one of the image paths
            'spec_name_1' => 'Warranty',
            'spec_detail_1' => $this->faker->randomElement(['1 year', '2 years', '6 months']),
            'spec_name_2' => 'Color',
            'spec_detail_2' => $this->faker->colorName(),
            'spec_name_3' => 'Material',
            'spec_detail_3' => $this->faker->randomElement(['Plastic', 'Metal', 'Fabric']),
            'spec_name_4' => 'Generation',
            'spec_detail_4' => $this->faker->randomElement(['1st', '2nd', '3rd']),
        ];
    }
}
