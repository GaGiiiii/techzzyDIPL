<?php

namespace App\Services\Product;

use App\Data\Product\ProductData;
use App\Models\Product;

class ProductService
{

    public function create(ProductData $productData): Product
    {
        $product = new Product();

        $product->category_id = $productData->category_id;
        $product->name = $productData->name;
        $product->desc = $productData->desc;
        $product->img = $productData->img;
        $product->stock = $productData->stock;
        $product->price = $productData->price;
        
        $product->save();

        return $product;
    }
}
