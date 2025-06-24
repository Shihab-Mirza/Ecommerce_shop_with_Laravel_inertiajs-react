<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    public function definition()
    {
        // Fallback in case no specific brand is provided
        $brands = [
            'Apple', 'Samsung', 'Lenovo', 'HP', 'Dell', 'Asus', 'Acer', 'Microsoft',
            'Sony', 'LG', 'Razer', 'MSI', 'Xiaomi', 'Huawei', 'Google', 'OnePlus',
            'JBL', 'Bose', 'Anker', 'Logitech', 'Corsair', 'Nvidia', 'AMD', 'Intel',
            'Toshiba', 'Alienware', 'Vivo', 'Oppo', 'Realme', 'ZTE', 'Nokia', 'Motorola',
            'HTC', 'Panasonic', 'Philips', 'Olufsen', 'Sennheiser', 'Roku', 'Netgear',
            'TP-Link', 'D-Link', 'Western Digital', 'Seagate', 'Kingston', 'SanDisk',
            'Epson', 'Canon', 'Brother', 'Garmin', 'Fitbit', 'Belkin', 'Roccat', 'SteelSeries'
        ];

        $subcategory = Subcategory::inRandomOrder()->first() ?? Subcategory::factory()->create();
        $category = Category::find($subcategory->category_id);

        return [
            'brand_name' => $this->faker->unique()->randomElement($brands),
            'subcategory_id' => $subcategory->id,
            'category_id' => $category->id,
        ];
    }

    // Custom state to set specific brand name, subcategory, and category
    public function forSubcategory($brandName, $subcategoryId, $categoryId)
    {
        return $this->state([
            'brand_name' => $brandName,
            'subcategory_id' => $subcategoryId,
            'category_id' => $categoryId,
        ]);
    }
}
