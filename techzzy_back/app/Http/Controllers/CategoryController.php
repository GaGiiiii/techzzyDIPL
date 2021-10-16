<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Validator;

class CategoryController extends Controller {
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index() {
    $categories = Category::with('products')->orderBy('created_at', 'DESC')->get();

    return response([
      "categories" => $categories,
      "message" => "Categories found",
    ], 200);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request) {
    if (auth()->user()->cannot('create', Category::class)) {
      return response([
        "category" => null,
        "message" => "Unauthorized.",
      ], 401);
    }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|min:2',
    ]);

    if ($validator->fails()) {
      return response([
        'category' => null,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $category = new Category;
    $category->name = $request->name;
    $category->save();

    $category = $category->fresh(['products']);

    return response([
      "category" => $category,
      "message" => "Category created.",
    ], 201);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function show($id) {
    $category = Category::find($id);

    if (!$category) {
      return response([
        'category' => null,
        'message' => 'Category not found.',
      ], 404);
    }

    return response([
      "category" => $category,
      "message" => "Category found",
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
    $category = Category::find($id);

    if (auth()->user()->cannot('update', $category)) {
      return response([
        "category" => $category,
        "message" => "Unauthorized.",
      ], 401);
    }

    if (!$category) {
      return response([
        'category' => null,
        'message' => 'Category not found.',
      ], 404);
    }

    // if (auth()->user()->cannot('update', $comment)) {
    //   return response(['message' => 'Unauthorized access!'], 401);
    // }

    // VALIDATE DATA
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|min:10',
    ]);

    if ($validator->fails()) {
      return response([
        'category' => $category,
        'message' => 'Validation failed.',
        'errors' => $validator->messages(),
      ], 400);
    }

    $category->name = $request->name;
    $category->save();

    $category = $category->fresh(['products']);

    return response([
      "category" => $category,
      "message" => "Category updated.",
    ], 200);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id) {
    $category = Category::find($id);

    if (auth()->user()->cannot('forceDelete', $category)) {
      return response([
        "category" => $category,
        "message" => "Unauthorized.",
      ], 401);
    }

    $category->delete();

    return response([
      "category" => $category,
      "message" => "Category deleted.",
    ], 200);
  }
}
