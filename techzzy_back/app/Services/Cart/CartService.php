<?php

namespace App\Services\Cart;

use App\Data\Cart\CartData;
use App\Models\Cart;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class CartService
{

    /**
     * Retrieves all the Carts.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Cart::all();
    }

    /**
     * Retrieves single Cart.
     *
     * @param int $id
     * @return Cart
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Cart
    {
        return Cart::with('comments', 'comments.user')->findOrFail($id);
    }

    /**
     * Creates a new Cart.
     *
     * @param CartData $cartData
     * @return Cart
     */
    public function create(CartData $cartData): Cart
    {
        $cart = new Cart();
        $cart = $cart->create($cartData->toArray());

        return $cart;
    }

    /**
     * Updates a existing Cart.
     *
     * @param CartData $cartData
     * @param Cart|null $cart
     * @return Cart
     * @throws ModelNotFoundException
     */
    public function update(CartData $cartData, ?Cart $cart): Cart
    {
        if ($cart === null) {
            throw new ModelNotFoundException();
        }

        $cart->update($cartData->toArray());

        return $cart;
    }

    /**
     * Deletes a existing Cart.
     *
     * @param Cart|null $cart
     * @return Cart
     */
    public function delete(?Cart $cart): Cart
    {
        if ($cart === null) {
            throw new ModelNotFoundException();
        }

        $cart->delete();

        return $cart;
    }
}
