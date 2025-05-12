<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Userpoint_rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class UserPointRuleController extends Controller
{
    /**
     * Display the point discounts management page.
     */
    public function index()
    {
        $earningRules = Userpoint_rule::whereNotNull('points_per_minimum_taka')
            ->whereNotNull('minimum_taka_spent')
            ->get()
            ->map(function ($discount) {
                return [
                    'id' => $discount->id,
                    'points_per_taka' => $discount->points_per_minimum_taka,
                    'taka_per_point' => $discount->minimum_taka_spent,
                ];
            });

        $redeemRules = Userpoint_rule::whereNotNull('minimum_points_spent')
            ->whereNotNull('discount_taka_for_points')
            ->get()
            ->map(function ($discount) {
                return [
                    'id' => $discount->id,
                    'points_per_taka' => $discount->minimum_points_spent,
                    'taka_per_point' => $discount->discount_taka_for_points,
                ];
            });

        return Inertia::render('AdminDashboard/AddPointsDiscount', [
            'earningRules' => $earningRules,
            'redeemRules' => $redeemRules,
            'flash' => session('flash'),
        ]);
    }

    /**
     * Store a new earn rule in storage.
     */
    public function storeEarnRule(Request $request)
    {
        // Check if an earn rule already exists
        $existingEarnRule = Userpoint_rule::whereNotNull('points_per_minimum_taka')
            ->whereNotNull('minimum_taka_spent')
            ->first();

        if ($existingEarnRule) {
            return Redirect::back()->withErrors(['error' => 'An earn rule already exists. Only one earn rule is allowed.'])->withInput();
        }

        $validator = Validator::make($request->all(), [
            'points_per_taka' => 'required|numeric|min:0',
            'taka_per_point' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['points_per_taka', 'taka_per_point']);

        $pointDiscount = Userpoint_rule::create([
            'minimum_taka_spent' => $data['taka_per_point'],
            'points_per_minimum_taka' => $data['points_per_taka'],
            'minimum_points_spent' => null,
            'discount_taka_for_points' => null,
        ]);

        return Redirect::route('point-discounts.index')->with('flash', 'Earn rule added successfully!');
    }

    /**
     * Store a new redeem rule in storage.
     */
    public function storeRedeemRule(Request $request)
    {
        // Check if a redeem rule already exists
        $existingRedeemRule = Userpoint_rule::whereNotNull('minimum_points_spent')
            ->whereNotNull('discount_taka_for_points')
            ->first();

        if ($existingRedeemRule) {
            return Redirect::back()->withErrors(['error' => 'A redeem rule already exists. Only one redeem rule is allowed.'])->withInput();
        }

        $validator = Validator::make($request->all(), [
            'points_per_taka' => 'required|numeric|min:0',
            'taka_per_point' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['points_per_taka', 'taka_per_point']);

        $pointDiscount = Userpoint_rule::create([
            'minimum_taka_spent' => null,
            'points_per_minimum_taka' => null,
            'minimum_points_spent' => $data['points_per_taka'],
            'discount_taka_for_points' => $data['taka_per_point'],
        ]);

        return Redirect::route('point-discounts.index')->with('flash', 'Redeem rule added successfully!');
    }

    /**
     * Update the specified point discount in storage.
     */
    public function update(Request $request, $id)
    {
        $pointDiscount = Userpoint_rule::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'points_per_taka' => 'required|numeric|min:0',
            'taka_per_point' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return Redirect::back()->withErrors($validator)->withInput();
        }

        $data = $request->only(['points_per_taka', 'taka_per_point']);
        $isEarnRule = $pointDiscount->points_per_minimum_taka !== null;

        $pointDiscount->update([
            'minimum_taka_spent' => $isEarnRule ? $data['taka_per_point'] : $pointDiscount->minimum_taka_spent,
            'points_per_minimum_taka' => $isEarnRule ? $data['points_per_taka'] : $pointDiscount->points_per_minimum_taka,
            'minimum_points_spent' => !$isEarnRule ? $data['points_per_taka'] : $pointDiscount->minimum_points_spent,
            'discount_taka_for_points' => !$isEarnRule ? $data['taka_per_point'] : $pointDiscount->discount_taka_for_points,
        ]);

        return Redirect::route('point-discounts.index')->with('flash', 'Point discount updated successfully!');
    }

    /**
     * Remove the specified point discount from storage.
     */
    public function destroy($id)
    {
        $pointDiscount = Userpoint_rule::findOrFail($id);
        $pointDiscount->delete();

        return Redirect::route('point-discounts.index')->with('flash', 'Rule deleted successfully!');
    }
}
