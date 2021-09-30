<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $carts = Cart::all();

    return response([
      "carts" => $carts,
      "message" => "Carts found",
    ], 200);
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

    $user = User::find($request->user_id);

    if (!$user) {
      return response([
        'cart' => null,
        'message' => 'User not found.',
      ], 400);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'user_id' => 'required|integer',
    ]);

    if ($validator->fails()) {
      return response([
        'cart' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $cart = new Cart;
    $cart->user_id = $request->user_id;
    $cart->save();

    return response([
      "cart" => $cart,
      "message" => "Cart created.",
    ], 201);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id) {
    $cart = Cart::find($id);

    if (!$cart) {
      return response([
        'cart' => null,
        'message' => 'Cart not found.',
      ], 404);
    }

    return response([
      "cart" => $cart,
      "message" => "Cart found",
    ], 200);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $id) {
    $cart = Cart::find($id);
    $user = User::find($request->user_id);

    if (!$cart || !$user) {
      return response([
        'cart' => null,
        'message' => 'Cart / User not found.',
      ], 404);
    }

    // if (auth()->user()->cannot('update', $comment)) {
    //   return response(['message' => 'Unauthorized access!'], 401);
    // }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'user_id' => 'required|integer',
    ]);

    if ($validator->fails()) {
      return response([
        'cart' => $cart,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $cart->user_id = $request->user_id;
    $cart->save();

    return response([
      "cart" => $cart,
      "message" => "Cart updated.",
    ], 200);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    $cart = Cart::find($id);

    // if (auth()->user()->cannot('delete', $cart)) {
    //   return back()->with('unauthorized', 'Unauthorized access!');
    // }

    $cart->delete();

    return response([
      "cart" => $cart,
      "message" => "Cart deleted.",
    ], 200);
  }
}
