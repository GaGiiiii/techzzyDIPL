<?php

namespace App\Http\Controllers;

use App\Data\Product\ProductData;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\Product\GetProductsRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Services\Product\ProductService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

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
     * @param  GetProductsRequest  $request
     * @return JsonResponse
     */
    public function index(GetProductsRequest $request)
    {
        try {
            $products = $this->productService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "products" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "products" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "products" => ProductResource::collection($products),
            "message" => "Products found",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateProductRequest  $request
     * @return JsonResponse
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
     * @param  GetProductsRequest  $request
     * @return JsonResponse
     */
    public function show(GetProductsRequest $request, int $id)
    {
        try {
            $product = $this->productService->getById($id);
        } catch (QueryException $e) {
            return response()->json([
                "product" => null,
                "message" => "Server Error",
            ], 500);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "product" => null,
                "message" => "Product not found",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "product" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "product" => new ProductResource($product),
            "message" => "Product found",
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateProductRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(UpdateProductRequest $request, int $id)
    {
        try {
            $product = $this->productService->update(ProductData::fromRequest($request), $request->product);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "product" => null,
                "message" => "Product not found.",
            ], 404);
        }

        return response([
            "product" => new ProductResource($product),
            "message" => "Product updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  DeleteProductRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(DeleteProductRequest $request, int $id)
    {
        try {
            $product = $this->productService->delete($request->product);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "product" => null,
                "message" => "Product not found.",
            ], 404);
        }

        return response([
            "product" => new ProductResource($product),
            "message" => "Product deleted.",
        ], 200);
    }
}
