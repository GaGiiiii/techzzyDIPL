<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'price',
        'type',
        'nestpay_response'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentProducts()
    {
        return $this->hasMany(PaymentProduct::class);
    }
}
