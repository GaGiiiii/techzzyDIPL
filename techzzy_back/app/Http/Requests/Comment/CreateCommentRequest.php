<?php

namespace App\Http\Requests\Comment;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CreateCommentRequest extends FormRequest
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
            'body' => 'required|min:20|max:10000|string',
            'product_id' => [
                'required',
                'integer',
                'min:1',
                'max:1000000',
                Rule::exists('products', 'id'),
            ],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'comment' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);

        throw new ValidationException($validator, $response);
    }
}
