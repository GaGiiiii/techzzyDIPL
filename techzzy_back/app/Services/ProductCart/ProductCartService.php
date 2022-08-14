<?php

namespace App\Services\ProductCart;

use App\Data\ProductCart\ProductCartData;
use App\Models\ProductCart;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class ProductCartService
{

    /**
     * Retrieves single ProductCart.
     *
     * @param int $id
     * @return ProductCart
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?ProductCart
    {
        return ProductCart::findOrFail($id);
    }

    /**
     * Creates a new ProductCart.
     *
     * @param ProductCartData $productCartData
     * @return ProductCart
     */
    public function create(ProductCartData $productCartData): ProductCart
    {
        $productCart = new ProductCart();
        $productCart = $productCart->create($productCartData->toArray());

        return $productCart->fresh(['product', 'cart', 'cart.user']);
    }

    /**
     * Updates a existing ProductCart.
     *
     * @param ProductCartData $productCartData
     * @param ProductCart|null $productCart
     * @return ProductCart
     * @throws ModelNotFoundException
     */
    public function update(ProductCartData $productCartData, ?ProductCart $productCart): ProductCart
    {
        if ($productCart === null) {
            throw new ModelNotFoundException();
        }

        $productCart->update($productCartData->toArray());

        return $productCart;
    }

    /**
     * Deletes a existing ProductCart.
     *
     * @param ProductCart $productCart
     * @return ProductCart
     */
    public function delete(?ProductCart $productCart): ProductCart
    {
        if ($productCart === null) {
            throw new ModelNotFoundException();
        }

        $productCart->delete();

        return $productCart;
    }
}
