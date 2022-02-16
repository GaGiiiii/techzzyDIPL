<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\GetProductsRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Validator;

class ProductController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
    public function index(GetProductsRequest $request)
    {
        $products = Product::with(['ratings', 'comments', 'category', 'comments.user'])->orderBy('id', 'desc')->get();

        return response([
        "products" => $products,
        "message" => "Products found",
        ], 200);
    }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
    public function store(Request $request)
    {
        $category = Category::find($request->category_id);

        if (!$category) {
            return response([
            'product' => null,
            'message' => 'Category not found.',
            ], 400);
        }

        if (auth()->user()->cannot('create', Product::class)) {
            return response([
            "product" => null,
            "message" => "Unauthorized.",
            ], 401);
        }

      // VALIDATE DATA
        $validator = Validator::make($request->all(), [
        'category_id' => 'required|integer',
        'name' => 'required|string|min:10',
        'desc' => 'required|string|min:10',
        'img' => 'required|string',
        'stock' => 'required|integer',
        'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response([
            'product' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);
        }

        $product = new Product();
        $product->category_id = $request->category_id;
        $product->name = $request->name;
        $product->desc = $request->desc;
        $product->img = $request->img;
        $product->stock = $request->stock;
        $product->price = $request->price;
        $product->save();

        $product = $product->fresh(['ratings', 'comments', 'category', 'comments.user']);

        return response([
        "product" => $product,
        "message" => "Product created.",
        ], 201);
    }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
    public function show(GetProductsRequest $request, $id)
    {
        $product = Product::with('comments', 'comments.user')->find($id);

        if (!$product) {
            return response([
            'product' => null,
            'message' => 'Product not found.',
            ], 404);
        }

        return response([
        "product" => $product,
        "message" => "Product found",
        ], 200);
    }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $category = Category::find($request->category_id);

        if (!$product || !$category) {
            return response([
            'product' => null,
            'message' => 'Product / Category not found.',
            ], 404);
        }

        if (auth()->user()->cannot('update', $product)) {
            return response([
            "product" => $product,
            "message" => "Unauthorized.",
            ], 401);
        }

      // VALIDATE DATA
        $validator = Validator::make($request->all(), [
        'category_id' => 'required|integer',
        'name' => 'required|string|min:10',
        'desc' => 'required|string|min:10',
        'img' => 'required|string',
        'stock' => 'required|integer',
        'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response([
            'product' => $product,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);
        }

        $product->category_id = $request->category_id;
        $product->name = $request->name;
        $product->desc = $request->desc;
        $product->img = $request->img;
        $product->stock = $request->stock;
        $product->price = $request->price;
        $product->save();

        $product = $product->fresh(['ratings', 'comments', 'category', 'comments.user']);

        return response([
        "product" => $product,
        "message" => "Product updated.",
        ], 200);
    }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (auth()->user()->cannot('forceDelete', $product)) {
            return response([
            "product" => $product,
            "message" => "Unauthorized.",
            ], 401);
        }

        $product->delete();

        return response([
        "product" => $product,
        "message" => "Product deleted.",
        ], 200);
    }
}
