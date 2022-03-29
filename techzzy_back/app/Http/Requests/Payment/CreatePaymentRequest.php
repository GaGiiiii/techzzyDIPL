<?php

namespace App\Http\Requests\Payment;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CreatePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->check() && auth()->user()->id === $this->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'price' => 'required|numeric|min:1|max:100000000',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'payment' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);

        throw new ValidationException($validator, $response);
    }
}
