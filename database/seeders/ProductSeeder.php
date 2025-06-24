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
        // Define category-to-subcategory mapping
        $subcategoryMap = [
            'Laptops' => ['Gaming Laptops', 'Ultrabooks', 'Workstations', 'Chromebooks'],
            'Smartphones' => ['Flagship Phones', 'Budget Phones', 'Foldable Phones'],
            'Tablets' => ['Android Tablets', 'iPads', 'Windows Tablets'],
            'Desktops' => ['Gaming PCs', 'All-in-One PCs', 'Mini PCs'],
            'Accessories' => ['Keyboards', 'Mice', 'Monitors', 'External Drives'],
            'Wearables' => ['Smartwatches', 'Fitness Trackers', 'AR Glasses'],
            'Audio' => ['Wireless Earbuds', 'Headphones', 'Speakers'],
            'Cameras' => ['DSLR Cameras', 'Mirrorless Cameras', 'Action Cameras'],
            'Networking' => ['Routers', 'Modems', 'Network Extenders']
        ];

        // Define subcategory-to-brand mapping
        $brandMap = [
            'Gaming Laptops' => ['Asus', 'Razer', 'MSI', 'Alienware', 'Acer'],
            'Ultrabooks' => ['Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft'],
            'Workstations' => ['Dell', 'HP', 'Lenovo'],
            'Chromebooks' => ['Acer', 'HP', 'Lenovo', 'Google'],
            'Flagship Phones' => ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
            'Budget Phones' => ['Xiaomi', 'Realme', 'Oppo', 'Vivo', 'Nokia'],
            'Foldable Phones' => ['Samsung', 'Huawei', 'Oppo'],
            'Android Tablets' => ['Samsung', 'Lenovo', 'Xiaomi'],
            'iPads' => ['Apple'],
            'Windows Tablets' => ['Microsoft', 'Lenovo', 'HP'],
            'Gaming PCs' => ['Alienware', 'MSI', 'Corsair', 'Asus'],
            'All-in-One PCs' => ['Apple', 'Dell', 'HP', 'Lenovo'],
            'Mini PCs' => ['Intel', 'Asus', 'Acer'],
            'Keyboards' => ['Logitech', 'Razer', 'Corsair', 'SteelSeries'],
            'Mice' => ['Logitech', 'Razer', 'Corsair', 'SteelSeries'],
            'Monitors' => ['Dell', 'HP', 'Samsung', 'LG', 'Acer'],
            'External Drives' => ['Western Digital', 'Seagate', 'SanDisk'],
            'Smartwatches' => ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Huawei'],
            'Fitness Trackers' => ['Fitbit', 'Garmin', 'Xiaomi'],
            'AR Glasses' => ['Google', 'Microsoft'],
            'Wireless Earbuds' => ['Apple', 'Samsung', 'JBL', 'Bose', 'Anker'],
            'Headphones' => ['Sony', 'Bose', 'Sennheiser', 'JBL'],
            'Speakers' => ['Bose', 'JBL', 'Olufsen'],
            'DSLR Cameras' => ['Canon', 'Nikon', 'Sony'],
            'Mirrorless Cameras' => ['Sony', 'Canon', 'Nikon', 'Panasonic'],
            'Action Cameras' => ['GoPro', 'DJI', 'Insta360'],
            'Home Consoles' => ['Sony', 'Microsoft', 'Nintendo'],
            'Portable Consoles' => ['Nintendo'],
            'Routers' => ['Netgear', 'TP-Link', 'Asus', 'Linksys'],
            'Modems' => ['Netgear', 'TP-Link', 'D-Link'],
            'Network Extenders' => ['Netgear', 'TP-Link', 'Linksys']
        ];

        // Seed all categories
        $categories = [];
        foreach (array_keys($subcategoryMap) as $categoryName) {
            $categories[] = Category::firstOrCreate(['name' => $categoryName]);
        }

        // Seed subcategories for each category
        $subcategories = [];
        foreach ($categories as $category) {
            foreach ($subcategoryMap[$category->name] as $subcategoryName) {
                $subcategories[] = Subcategory::firstOrCreate([
                    'sub_category_name' => $subcategoryName,
                    'category_id' => $category->id,
                ]);
            }
        }

        // Seed brands for each subcategory based on the brand map
        foreach ($subcategories as $subcategory) {
            $category = Category::find($subcategory->category_id);
            $brands = $brandMap[$subcategory->sub_category_name] ?? [];
            foreach ($brands as $brandName) {
                Brand::firstOrCreate([
                    'brand_name' => $brandName,
                    'subcategory_id' => $subcategory->id,
                    'category_id' => $category->id,
                ]);
            }
        }

        // Seed 500 products
        Product::factory()->count(100)->create();
    }
}
