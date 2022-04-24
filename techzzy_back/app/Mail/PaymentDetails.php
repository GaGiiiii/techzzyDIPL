<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentDetails extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $payment;
    public $paymentProducts;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Payment $payment, Collection $paymentProducts)
    {
        $this->payment = $payment;
        $this->paymentProducts = $paymentProducts;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('dragoslav.gagi8@gmail.com', 'Techzzy')
            ->subject('Payment Details')
            ->view('emails.payments.payment_details');
    }
}
