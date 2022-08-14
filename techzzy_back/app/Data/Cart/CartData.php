<?php

namespace App\Data\Cart;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class CartData extends DataTransferObject
{
    public int $user_id;

    public static function fromRequest(Request $request)
    {
        return new static([
            'user_id' => $request->user_id,
        ]);
    }
}
