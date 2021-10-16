<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentProduct;
use App\Models\Product;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class PaymentController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    if (auth()->user()->cannot('viewAny', Payment::class)) {
      return response([
        "payments" => null,
        "message" => "Unauthorized.",
      ], 401);
    }

    $payments = Payment::with(['paymentProducts', 'paymentProducts.product', 'user'])->get();

    return response([
      "payments" => $payments,
      "message" => "Payments found",
    ], 200);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request) {
    if (auth()->user()->id !== $request->user_id) {
      return response([
        "payment" => null,
        "message" => "Unauthorized.",
      ], 401);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'price' => 'required|numeric',
    ]);

    if ($validator->fails()) {
      return response([
        'payment' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    DB::beginTransaction();

    // Save Payment
    $payment = new Payment;
    $payment->user_id = $request->user_id;
    $payment->price = $request->price;
    $payment->order_id = $request->order_id;
    $payment->save();

    // Delete From Cart
    $cartID = User::find($request->user_id)->cart->id; // Find Users Cart
    $pcs = ProductCart::where('cart_id', $cartID)->get(); // Find Items In Cart
    $pcsArr = $pcs->toArray(); // Convert To Array
    $pcs->each->delete(); // Delete from cart

    // Save Products In Aggregation So We Know Which Product is in Which Payment And How Much
    foreach ($request->products as $product) {
      $pp = new PaymentProduct;
      $pp->product_id = $product['id'];
      $pp->payment_id = $payment->id;

      // Find In Cart Product And See How Much is count
      $filteredArr = array_filter($pcsArr, function ($pc) use ($product) {
        return $pc['product_id'] === $product['id'];
      });
      $filteredArrFix = array_values($filteredArr); // Fix Array
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

    return response([
      "payment" => $payment,
      "payment2" => $request->products[0],
      "message" => "Payment created.",
    ], 201);
  }
}
