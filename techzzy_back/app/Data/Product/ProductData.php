<?php

namespace App\Data\Product;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class ProductData extends DataTransferObject
{
    public int $category_id;
    public string $name;
    public string $desc;
    public string $img;
    public int $stock;
    public float $price;

    public static function fromRequest(Request $request)
    {
        return new static([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'desc' => $request->desc,
            'img' => $request->img,
            'stock' => $request->stock,
            'price' => (float) $request->price,
        ]);
    }
}
