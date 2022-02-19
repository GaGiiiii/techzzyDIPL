<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\CreateCartRequest;
use App\Http\Requests\Cart\DeleteCartRequest;
use App\Http\Requests\Cart\GetCartRequest;
use App\Http\Requests\Cart\GetCartsRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Resources\Cart\CartResource;
use App\Services\Cart\CartService;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{

    private CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->CartService = $cartService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetCartsRequest $request
     * @return JsonResponse
     */
    public function index(GetCartsRequest $request)
    {
        try {
            $carts = $this->cartService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "carts" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "carts" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "carts" => CartResource::collection($carts),
            "message" => "Carts found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateCartRequest  $request
     * @return JsonResponse
     */
    public function store(CreateCartRequest $request)
    {
        try {
            $cart = $this->cartService->create(CartData::fromRequest($request));
        } catch (QueryException $e) {
            return response()->json([
                "cart" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "cart" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "cart" => new CartResource($cart),
            "message" => "Cart created.",
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  GetCartRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(GetCartRequest $request, int $id)
    {
        try {
            $cart = $this->cartService->getById($id);
        } catch (QueryException $e) {
            return response()->json([
                "cart" => null,
                "message" => "Server Error",
            ], 500);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "cart" => null,
                "message" => "Cart not found",
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                "cart" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "cart" =>  new CartResource($cart),
            "message" => "cart found",
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateCartRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(UpdateCartRequest $request, int $id)
    {
        try {
            $cart = $this->cartService->update(CartData::fromRequest($request), $request->cart);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "cart" => null,
                "message" => "Cart not found.",
            ], 404);
        }

        return response([
            "cart" => new CartResource($cart),
            "message" => "Cart updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  DeleteCartRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(DeleteCartRequest $request, int $id)
    {
        try {
            $cart = $this->cartService->delete($request->cart);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "cart" => null,
                "message" => "Cart not found.",
            ], 404);
        }

        return response([
            "cart" => new CartResource($cart),
            "message" => "Cart deleted.",
        ], 200);
    }
}
