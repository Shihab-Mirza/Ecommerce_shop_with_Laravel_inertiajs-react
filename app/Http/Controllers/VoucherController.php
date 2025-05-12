<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index()
    {
        return Inertia::render('AdminDashboard/AddVoucherComponent', [
            'vouchers' => Voucher::all()->map(function ($voucher) {
                return [
                    'id' => $voucher->id,
                    'voucher_code' => $voucher->voucher_code,
                    'voucher_discount' => $voucher->voucher_discount,
                ];
            }),
            'flash' => session('flash'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'voucher_code' => 'required|string|max:255|unique:vouchers,voucher_code',
            'voucher_discount' => 'required|numeric|min:0.01|max:100', // Changed min:0 to min:0.01
        ]);

        $voucher = Voucher::create($validated);

        return redirect()->back()->with('flash', 'Voucher added successfully!')->with('vouchers', Voucher::all()->map(function ($voucher) {
            return [
                'id' => $voucher->id,
                'voucher_code' => $voucher->voucher_code,
                'voucher_discount' => $voucher->voucher_discount,
            ];
        }));
    }

    public function update(Request $request, Voucher $voucher)
    {
        $validated = $request->validate([
            'voucher_code' => 'required|string|max:255|unique:vouchers,voucher_code,' . $voucher->id,
            'voucher_discount' => 'required|numeric|min:0.01|max:100', // Changed min:0 to min:0.01
        ]);

        $voucher->update($validated);

        return redirect()->back()->with('flash', 'Voucher updated successfully!')->with('vouchers', Voucher::all()->map(function ($voucher) {
            return [
                'id' => $voucher->id,
                'voucher_code' => $voucher->voucher_code,
                'voucher_discount' => $voucher->voucher_discount,
            ];
        }));
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();

        return redirect()->back()->with('flash', 'Voucher deleted successfully!')->with('vouchers', Voucher::all()->map(function ($voucher) {
            return [
                'id' => $voucher->id,
                'voucher_code' => $voucher->voucher_code,
                'voucher_discount' => $voucher->voucher_discount,
            ];
        }));
    }
}
