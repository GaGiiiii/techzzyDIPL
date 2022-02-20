<?php

namespace App\Http\Requests\ProductCart;

use App\Services\ProductCart\ProductCartService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateProductCartRequest extends FormRequest
{

    private ProductCartService $productCartService;

    public function __construct(ProductCartService $productCartService)
    {
        $this->productCartService = $productCartService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->product_cart = $this->productCartService->getById($this->product_cart);
        } catch (ModelNotFoundException $e) {
            $this->product_cart = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->product_cart);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'count' => 'required|int|min:1|max:1000',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'product_cart' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
            ], 400);

        throw new ValidationException($validator, $response);
    }
}
