<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class RatingController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $ratings = Rating::all();

    return response([
      "ratings" => $ratings,
      "message" => "Ratings found",
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

    $product = Product::find($request->product_id);
    $user = User::find($request->user_id);

    if (!$product || !$user) {
      return response([
        'product' => null,
        'message' => 'Product / User not found.',
      ], 400);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'product_id' => 'required|integer',
      'user_id' => 'required|integer',
      'rating' => 'required|integer',
    ]);

    if ($validator->fails()) {
      return response([
        'product' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $rating = new Rating;

    $rating->user_id = $request->user_id;
    $rating->product_id = $request->product_id;
    $rating->rating = $request->rating;

    $rating->save();

    return response([
      "rating" => $rating,
      "message" => "Rating created.",
    ], 201);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id) {
    $rating = Rating::find($id);

    if (!$rating) {
      return response([
        'rating' => null,
        'message' => 'Rating not found.',
      ], 404);
    }

    return response([
      "rating" => $rating,
      "message" => "Rating found",
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
    $rating = Rating::find($id);

    if (!$rating) {
      return response([
        'rating' => null,
        'message' => 'Rating not found.',
      ], 404);
    }

    // if (auth()->user()->cannot('update', $comment)) {
    //   return response(['message' => 'Unauthorized access!'], 401);
    // }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'product_id' => 'required|integer',
      'user_id' => 'required|integer',
      'rating' => 'required|integer',
    ]);

    if ($validator->fails()) {
      return response([
        'rating' => $rating,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $rating->user_id = $request->user_id;
    $rating->product_id = $request->product_id;
    $rating->rating = $request->rating;

    $rating->save();

    return response([
      "rating" => $rating,
      "message" => "Rating updated.",
    ], 200);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    $rating = Rating::find($id);

    // if (auth()->user()->cannot('delete', $rating)) {
    //   return back()->with('unauthorized', 'Unauthorized access!');
    // }

    $rating->delete();

    return response([
      "rating" => $rating,
      "message" => "Rating deleted.",
    ], 200);
  }
}
