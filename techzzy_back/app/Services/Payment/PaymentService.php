<?php

namespace App\Services\Payment;

use App\Data\Payment\PaymentData;
use App\Models\Payment;
use App\Models\PaymentProduct;
use App\Models\Product;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{

    /**
     * Retrieves all the categories.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Payment::with(['paymentProducts', 'paymentProducts.product', 'user'])->get();
    }

    /**
     * Retrieves single Payment.
     *
     * @param int $id
     * @return Payment
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Payment
    {
        return Payment::with('products')->findOrFail($id);
    }

    /**
     * Creates a new Payment.
     *
     * @param PaymentData $paymentData
     * @return Payment
     */
    public function create(PaymentData $paymentData): Payment
    {
        DB::beginTransaction(); // TO DO TODO

        // Save Payment
        $payment = new Payment();
        $payment = $payment->create($paymentData->toArray());

        // Delete From Cart
        $cartID = User::find($paymentData->user_id)->cart->id; // Find Users Cart
        $pcs = ProductCart::where('cart_id', $cartID)->get(); // Find Items In Cart
        $pcsArr = $pcs->toArray(); // Convert To Array
        $pcs->each->delete(); // Delete from cart

        Log::debug($paymentData->products);

        // Save Products In Aggregation So We Know Which Product is in Which Payment And How Much
        foreach ($paymentData->products as $product) {
            Log::debug($product);
            Log::debug($product['id']);
            Log::debug($pcsArr);

            $pp = new PaymentProduct();
            $pp->product_id = $product['id'];
            $pp->payment_id = $payment->id;

            // Find In Cart Product And See How Much is count
            $filteredArr = array_filter($pcsArr, function ($pc) use ($product) {
                return $pc['product_id'] === $product['id'];
            });
            Log::debug(['filtered' => $filteredArr]);

            $filteredArrFix = array_values($filteredArr); // Fix Array
            Log::debug(['filteredfix' => $filteredArrFix]);

            $pp->count = $filteredArrFix[0]['count'];
            $pp->save();

            // Updating stock of bought products
            $productToUpdate = Product::find($product['id']);
            $productToUpdate->stock -= $pp->count;
            // If product is out of stock rollback
            if ($productToUpdate->stock < 0) {
                DB::rollBack();
                return response([
                    'payment' => null,
                    'message' => 'Payment failed.',
                    'errors' => [0 => ["Product out of stock - $productToUpdate->name"]],
                ], 400);
            }
            $productToUpdate->save();
        }

        $payment = $payment->fresh(['user']);
        DB::commit();

        return $payment;
    }
}
