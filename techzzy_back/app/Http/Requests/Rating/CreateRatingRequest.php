<?php

namespace App\Http\Requests\Rating;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CreateRatingRequest extends FormRequest
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
            'rating' => 'required|integer|min:1|max:10',
            'product_id' => [
                'required',
                'integer',
                'min:1',
                'max:1000000',
                Rule::exists('products', 'id'),
            ],
            'user_id' => [
                'required',
                'integer',
                'min:1',
                'max:1000000',
                Rule::exists('users', 'id'),
            ],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'rating' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);

        throw new ValidationException($validator, $response);
    }
}
