<h3>Congratulations, your payment was successful.</h3>
<h4>Here are your payment details:</h4>
<div>
    <p><span style="font-weight: bold">Order ID:</span> {{ $payment->order_id }}</p>
    <p>
        <span style="font-weight: bold">Products:</span>
        @for ($i = 0; $i < sizeof($paymentProducts); $i++)
            @if (isset($paymentProducts[$i + 1]))
                {{ $paymentProducts[$i]->product->name . ' (x' . $paymentProducts[$i]->count . ')' }},&nbsp;
            @else
                {{ $paymentProducts[$i]->product->name . ' (x' . $paymentProducts[$i]->count . ')' }}
            @endif
        @endfor
    </p>
    <p><span style="font-weight: bold">Price:</span> {{ $payment->price }} RSD
        ({{ round($payment->price / 117, 2) }}&euro;)</p>
    <p><span style="font-weight: bold">Payment Type:</span> {{ $payment->type }}</p>
</div>
