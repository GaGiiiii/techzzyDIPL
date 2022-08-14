<?php

namespace App\Http\Requests\Product;

use App\Services\Product\ProductService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateProductRequest extends FormRequest
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->product = $this->productService->getById($this->product);
        } catch (ModelNotFoundException $e) {
            $this->product = null;
            
            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->product);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'category_id' => [
                'required',
                'integer',
                'min:1',
                'max:1000000',
                Rule::exists('categories', 'id'),
            ],
            'name' => 'required|string|min:10',
            'desc' => 'required|string|min:10',
            'img' => 'required|string|max:5000',
            'stock' => 'required|integer|min:0|max:10000',
            'price' => 'required|numeric|min:1|max:1000000000',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'product' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
        ], 400);

        throw new ValidationException($validator, $response);
    }
}
