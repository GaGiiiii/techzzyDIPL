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
    $product_cart = ProductCart::find($id);

    if (!$product_cart) {
      return response([
        'product_cart' => null,
        'message' => 'ProductCart not found.',
      ], 404);
    }

    if (auth()->user()->cannot('update', $product_cart)) {
      return response([
        "product_cart" => $product_cart,
        "message" => "Unauthorized.",
      ], 401);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'count' => 'required',
    ]);

    if ($validator->fails()) {
      return response([
        'product_cart' => $product_cart,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $product_cart->count = $request->count;
    $product_cart->save();

    return response([
      "product_cart" => $product_cart,
      "message" => "Product count update updated.",
    ], 200);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    $product_cart = ProductCart::find($id);

    if (auth()->user()->cannot('forceDelete', $product_cart)) {
      return response([
        "product_cart" => $product_cart,
        "message" => "Unauthorized.",
      ], 401);
    }

    $product_cart->delete();

    return response([
      "product_cart" => $product_cart,
      "message" => "Product removed from cart.",
    ], 200);
  }
}
