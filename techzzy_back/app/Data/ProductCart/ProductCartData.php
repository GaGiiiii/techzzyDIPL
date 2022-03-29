<?php

namespace App\Data\ProductCart;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class ProductCartData extends DataTransferObject
{
    public int $product_id;
    public int $cart_id;
    public int $count;

    public static function fromRequest(Request $request)
    {
        return new static([
            'product_id' => $request->product_id,
            'cart_id' =>  auth()->user()->cart['id'],
            'count' => $request->count,
        ]);
    }
}
