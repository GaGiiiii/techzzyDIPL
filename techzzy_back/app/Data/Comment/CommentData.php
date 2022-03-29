<?php

namespace App\Data\Comment;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class CommentData extends DataTransferObject
{
    public int $user_id;
    public int $product_id;
    public string $body;

    public static function fromRequest(Request $request)
    {
        return new static([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'body' => $request->body,
        ]);
    }
}
