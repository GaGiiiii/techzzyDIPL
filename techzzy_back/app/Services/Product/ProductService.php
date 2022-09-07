<?php

namespace App\Services\Product;

use App\Data\Product\ProductData;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class ProductService
{
    /**
     * Retrieves all the products.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Product::with(['ratings', 'comments', 'category', 'comments.user'])->orderBy('id', 'desc')->get();
    }

    /**
     * Retrieves single product.
     *
     * @param int $id
     * @return Product
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?Product
    {
        return Product::with('comments', 'comments.user')->findOrFail($id);
    }

    /**
     * Creates a new product.
     *
     * @param ProductData $productData
     * @return Product
     */
    public function create(ProductData $productData): Product
    {
        $product = new Product();
        $product = $product->create($productData->toArray());

        return $product->fresh(['category']);
    }

    /**
     * Updates a existing product.
     *
     * @param ProductData $productData
     * @param Product|null $product
     * @return Product
     * @throws ModelNotFoundException
     */
    public function update(ProductData $productData, ?Product $product): Product
    {
        if ($product === null) {
            throw new ModelNotFoundException();
        }

        $product->update($productData->toArray());

        return $product->fresh(['ratings', 'comments', 'category', 'comments.user']);
    }

    /**
     * Deletes a existing product.
     *
     * @param Product|null $product
     * @return Product
     */
    public function delete(?Product $product): Product
    {
        if ($product === null) {
            throw new ModelNotFoundException();
        }

        $product->delete();

        return $product;
    }
}
