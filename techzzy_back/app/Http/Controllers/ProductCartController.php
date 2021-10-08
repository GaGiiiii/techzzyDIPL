<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCart;
use Illuminate\Http\Request;
use Validator;

class ProductCartController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    //
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request) {
    // if ($request->user_id != auth()->user()->id) {
    //   return back()->with('unauthorized', 'Unauthorized access!');
    // }

    $product = Product::find($request->product_id);

    if (!$product) {
      return response([
        'product_cart' => null,
        'message' => 'Product not found.',
      ], 400);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'count' => 'required|int',
    ]);

    if ($validator->fails()) {
      return response([
        'product_cart' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $product_cart = new ProductCart;

    $product_cart->count = $request->count;
    $product_cart->cart_id = auth()->user()->cart['id'];
    $product_cart->product_id = $request->product_id;

    $product_cart->save();
    $product_cart = $product_cart->fresh(['product', 'cart', 'cart.user']);

    return response([
      "product_cart" => $product_cart,
      "message" => "product_cart created.",
    ], 201);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id) {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id) {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    //
  }
}