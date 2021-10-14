<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $users = User::all();

    return response([
      "users" => $users,
      "message" => "Users found",
    ], 200);
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
    $user = User::find($id);

    if (!$user) {
      return response([
        'user' => null,
        'message' => 'User not found.',
      ], 404);
    }

    // if (auth()->user()->cannot('update', $comment)) {
    //   return response(['message' => 'Unauthorized access!'], 401);
    // }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'first_name' => 'required|alpha|max:255',
      'last_name' => 'required|alpha|max:255',
      'username' => 'required|alpha_dash|max:255|unique:users,username,' . auth()->user()->id,
      'email' => 'required|string|email|max:255|unique:users,email,' . auth()->user()->id,
      'img' => 'image|file|max:5000',
      'password' => 'nullable|min:6|confirmed',
    ]);

    if ($validator->fails()) {
      return response([
        'user' => $user,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $user->first_name = $request->first_name;
    $user->last_name = $request->last_name;
    $user->username = $request->username;
    $user->email = $request->email;

    // CHECK IF IMAGE IS UPLOADED
    if (isset($request->img)) {
      // DELETE OLD USER PHOTO
      Storage::deleteDirectory('avatars/' .  auth()->user()->username);

      // CREATE UNIQUE FILENAME AND STORE IT UNIQUE FOLDER
      $fileName = auth()->user()->username . "_" . date('dmY_Hs') . "." . $request->img->extension() ?? null;
      $path = $request->file('img')->storeAs('avatars/' . auth()->user()->username, $fileName);
      $user->img = $fileName;
    }

    if (!empty($request->password) && $request->password === $request->password_confirmation) {
      $user->password = Hash::make($request->password);
    }

    $user->save();

    $user = $user->fresh(['comments', 'comments.product', 'ratings', 'ratings.product', 'cart', 'cart.productCarts']);

    return response([
      "user" => $user,
      "message" => "User updated.",
    ], 200);
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

    $user = $user->fresh(['comments', 'comments.product', 'ratings', 'ratings.product', 'cart', 'cart.productCarts']);

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
    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'first_name' => 'required|alpha|min:2',
      'last_name' => 'required|alpha|min:2',
      'username' => 'required|alpha_dash|min:2|unique:users,username',
      'email' => 'required|string|email|unique:users,email',
      'password' => 'required|string|min:6|confirmed',
      'img' => 'file|image|max:5000',
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

    // CHECK IF IMAGE IS UPLOADED
    if (isset($request->img)) {
      // CREATE UNIQUE FILENAME AND STORE IT UNIQUE FOLDER
      $fileName = $user->username . "_" . date('dmY_Hs') . "." . $request->img->extension() ?? null;
      $path = $request->file('img')->storeAs('avatars/' . $user->username, $fileName);
      $user->img = $fileName;
    }


    $user->save();
    $cart = new Cart;
    $cart->user_id = $user->id;
    $cart->save();
    $token = $user->createToken('usertoken');

    return response([
      "user" => $user,
      "message" => "User created.",
      'token' => $token->plainTextToken,
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

  public function getAllPayments($user_id) {
    $user = User::with(['payments', 'payments.paymentProducts', 'payments.paymentProducts.product'])->where('id', $user_id)->get();
    $payments = $user[0]['payments'];

    return response([
      "payments" => $payments,
      "message" => "Payments found",
    ], 200);
  }
}
