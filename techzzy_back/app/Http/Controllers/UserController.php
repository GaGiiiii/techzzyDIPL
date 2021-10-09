<?php

namespace App\Http\Controllers;

use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class UserController extends Controller {
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
    //
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

  /**
   * Remove the specified resource from storage.
   *
   * @return \Illuminate\Http\Response
   */
  public function login(Request $request) {
    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'password' => 'required|string',
    ]);

    if ($validator->fails()) {
      return response([
        'user' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
      return response([
        "user" => null,
        "message" => "Login failed.",
      ], 401);
    }

    $token = $user->createToken('usertoken');

    $user = $user->fresh(['comments', 'ratings', 'cart', 'cart.productCarts']);

    return response([
      "user" => $user,
      "message" => "Login successful",
      'token' => $token->plainTextToken,
    ], 200);
  }

  public function logout(Request $request) {
    $user = auth()->user();
    $user->tokens()->delete();

    return response([
      "user" => $user,
      "message" => "Logout successful.",
    ], 200);
  }

  public function register(Request $request) {
    return 22;
    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'first_name' => 'required|string|min:2',
      'last_name' => 'required|string|min:2',
      'username' => 'required|string|min:2|unique:users,username',
      'email' => 'required|string|email|unique:users,email',
      'password' => 'required|string|min:6|confirmed',
    ]);

    if ($validator->fails()) {
      return response([
        'user' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $user = new User;
    $user->first_name = $request->first_name;
    $user->last_name = $request->last_name;
    $user->username = $request->username;
    $user->email = $request->email;
    $user->password = Hash::make($request->password);
    $user->save();

    return response([
      "user" => $user,
      "message" => "User created.",
    ], 201);
  }

  public function loggedIn() {
    if (auth()->user()) {
      return response([
        "user" => auth()->user(),
        "message" => "User logged in.",
      ], 200);
    }

    return response([
      "user" => null,
      "message" => "Not logged in.",
    ], 401);
  }

  public function getAllProductsInCart($user_id) {
    $user = User::find($user_id);
    $pcs = ProductCart::with('product', 'product.ratings', 'product.category')->where('cart_id', $user->cart->id)->get();
    $products = [];

    foreach ($pcs as $pc) {
      $product = $pc['product'];
      $product->count = $pc->count;
      $product->pcID = $pc->id;
      array_push($products, $product);
    }

    return response([
      "products" => $products,
      "message" => "Products found",
    ], 200);
  }
}
