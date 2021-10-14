<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentProduct;
use App\Models\Product;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class PaymentController extends Controller {
  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request) {
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

    $payment = new Payment;
    $payment->user_id = $request->user_id;
    $payment->price = $request->price;
    $payment->order_id = $request->order_id;
    $payment->save();

    // Delete From Cart
    $cartID = User::find($request->user_id)->cart->id;
    ProductCart::where('cart_id', $cartID)->get()->each->delete();

    // Save Products
    foreach($request->products as $product){
      $pp = new PaymentProduct;
      $pp->product_id = $product['id'];
      $pp->payment_id = $payment->id;
      $pp->save();
    }

    $payment = $payment->fresh(['user']);

    return response([
      "payment" => $payment,
      "payment2" => $request->products[0],
      "message" => "Payment created.",
    ], 201);
  }
}
