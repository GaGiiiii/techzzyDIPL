<?php

namespace App\Data\Rating;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class RatingData extends DataTransferObject
{
    public int $product_id;
    public int $user_id;
    public int $rating;

    public static function fromRequest(Request $request)
    {
        return new static([
            'product_id' => $request->product_id,
            'user_id' =>  auth()->user()->id,
            'rating' => $request->rating,
        ]);
    }
}
