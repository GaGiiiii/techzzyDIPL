<?php

namespace App\Data\Category;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class CategoryData extends DataTransferObject
{
    public string $name;

    public static function fromRequest(Request $request)
    {
        return new static([
            'name' => $request->name,
        ]);
    }
}
