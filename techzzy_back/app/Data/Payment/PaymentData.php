<?php

namespace App\Data\Payment;

use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class PaymentData extends DataTransferObject
{
    public int $user_id;
    public string $order_id;
    public float $price;
    public string $type;
    public ?string $nestpay_response;
    public array $products;

    public static function fromRequest(Request $request)
    {
        return new static([
            'user_id' => $request->user_id,
            'order_id' => $request->order_id,
            'price' => $request->price,
            'type' => $request->type,
            'nestpay_response' => $request->nestpay_response,
            'products' => $request->products,
        ]);
    }
}
