<?php

namespace App\Console\Commands;

use App\Models\Offer;
use App\Models\Sell;
use Illuminate\Support\Facades\Log;
use Illuminate\Console\Command;

class UpdateExpiredOffers extends Command
{
    protected $signature = 'offers:update-expired';
    protected $description = 'Update products with expired offers by setting is_offered_product to false';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Find offers that have expired (end_date is in the past)
        $expiredOffers = Offer::where('end_date', '<=', now())->get();

        foreach ($expiredOffers as $offer) {
            // Update the related product's is_offered_product to false
            $product = $offer->product;
            if ($product) {
                $product->update(['is_offered_product' => 'no']);
                $this->info("Updated product ID {$product->id} - Offer expired.");
            }
        }

        $this->info('Expired offers processed successfully.');
        return 0;
    }
}