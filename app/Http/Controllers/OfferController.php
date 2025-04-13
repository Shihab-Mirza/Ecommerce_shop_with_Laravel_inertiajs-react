<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $productsQuery = Product::with(['offer', 'category', 'subcategory', 'brand'])
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('subcategory', function ($q) use ($search) {
                        $q->where('sub_category_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('brand_name', 'like', "%{$search}%");
                    });
            });

        $products = $productsQuery->paginate($perPage);
        if ($search) {
            $products->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/AddOffer', [
            'products' => $products,
            'flash' => session('success'),
            'search' => $search,
        ]);
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:products,id',
            'offer.is_offered_product' => 'required|in:yes,no',
            'offer.discount_type' => 'nullable|in:unlimited,fixed',
            'offer.offer_price' => [
                'nullable',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->offer['is_offered_product'] === 'yes' && empty($value)) {
                        $fail('Offer price is required when product is offered.');
                    }
                },
            ],
            'offer.start_date' => [
                'nullable',
                'date',
                'required_if:offer.discount_type,fixed',
            ],
            'offer.end_date' => [
                'nullable',
                'date',
                'required_if:offer.discount_type,fixed',
                'after_or_equal:offer.start_date',
            ],
            'offer.is_active' => 'required|in:yes,no',
        ]);

        $product = Product::findOrFail($request->id);

        // Update product is_offered_product status
        $product->is_offered_product = $request->offer['is_offered_product'];
        $product->save();

        // If not an offered product, delete any existing offer
        if ($request->offer['is_offered_product'] === 'no') {
            Offer::where('product_id', $product->id)->delete();
            return redirect()->route('offers.index')->with('success', 'Offer removed successfully!');
        }

        // Calculate discount value
        $discountValue = $request->offer['offer_price']
            ? ($product->price - floatval($request->offer['offer_price']))
            : 0;

        // Validate discount value
        if ($discountValue < 0) {
            return back()->withErrors(['offer.offer_price' => 'Discount value cannot be negative (The offer price cannot be greater than the product price.).']);
        }

        // Prepare offer data
        $offerData = [
            'product_id' => $product->id,
            'discount_type' => $request->offer['discount_type'],
            'offer_price' => $request->offer['offer_price'] ? floatval($request->offer['offer_price']) : null,
            'discount_value' => $discountValue,
            'is_active' => $request->offer['is_active'],
            'start_date' => $request->offer['discount_type'] === 'unlimited' ? null : $request->offer['start_date'],
            'end_date' => $request->offer['discount_type'] === 'unlimited' ? null : $request->offer['end_date'],
        ];

        // Update or create offer
        Offer::updateOrCreate(
            ['product_id' => $product->id],
            $offerData
        );

        return redirect()->route('offers.index')->with('success', 'Offer updated successfully!');
    }
}
