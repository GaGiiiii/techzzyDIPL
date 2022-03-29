<?php

namespace App\Http\Controllers;

use App\Data\ProductCart\ProductCartData;
use App\Http\Requests\Product\DeleteProductRequest;
use App\Http\Requests\ProductCart\CreateProductCartRequest;
use App\Http\Requests\ProductCart\DeleteProductCartRequest;
use App\Http\Requests\ProductCart\UpdateProductCartRequest;
use App\Http\Resources\ProductCart\ProductCartResource;
use App\Models\Product;
use App\Models\ProductCart;
use App\Services\ProductCart\ProductCartService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Validator;

class ProductCartController extends Controller
{

    private ProductCartService $productCartService;

    public function __construct(ProductCartService $productCartService)
    {
        $this->productCartService = $productCartService;
    }

  /**
   * Display a listing of the resource.
   *
   * @return JsonResponse
   */
    public function index()
    {
      //
    }

  /**
   * Store a newly created resource in storage.
   *
   * @param  CreateProductCartRequest $request
   * @return JsonResponse
   */
    public function store(CreateProductCartRequest $request)
    {
        try {
            $productCart = $this->productCartService->create(ProductCartData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "product_cart" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "product_cart" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "product_cart" => new ProductCartResource($productCart),
            "message" => "ProductCart created.",
        ], 201);
    }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return JsonResponse
   */
    public function show($id)
    {
      //
    }

  /**
   * Update the specified resource in storage.
   *
   * @param  UpdateProductCartRequest  $request
   * @param  int  $id
   * @return JsonResponse
   */
    public function update(UpdateProductCartRequest $request, int $id)
    {
        try {
            $productCart = $this->productCartService->update(
                ProductCartData::fromRequest($request),
                $request->product_cart
            );
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "product_cart" => null,
                "message" => "ProductCart not found.",
            ], 404);
        }

        return response([
            "productCart" => new ProductCartResource($productCart),
            "message" => "ProductCart updated.",
        ], 200);
    }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return JsonResponse
   */
    public function destroy(DeleteProductCartRequest $request, int $id)
    {
        try {
            $productCart = $this->productCartService->delete($request->product_cart);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "product_cart" => null,
                "message" => "ProductCart not found.",
            ], 404);
        }

        return response([
            "product_cart" => new ProductCartResource($productCart),
            "message" => "ProductCart deleted.",
        ], 200);
    }
}
