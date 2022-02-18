<?php

namespace App\Http\Controllers;

use App\Data\Product\ProductData;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\GetProductsRequest;
use App\Http\Resources\Product\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\Product\ProductService;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Validator;

class ProductController extends Controller
{

    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GetProductsRequest $request)
    {
        $products = Product::with(['ratings', 'comments', 'category', 'comments.user'])->orderBy('id', 'desc')->get();

        return response()->json([
            "products" => ProductResource::collection($products),
            "message" => "Products found",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CreateProductRequest $request)
    {
        try {
            $product = $this->productService->create(ProductData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "product" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "product" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "product" => new ProductResource($product),
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
