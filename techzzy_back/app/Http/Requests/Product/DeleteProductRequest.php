<?php

namespace App\Http\Requests\Product;

use App\Services\Product\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;

class DeleteProductRequest extends FormRequest
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

        return auth()->check() && auth()->user()->can('forceDelete', $this->product);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
        ];
    }
}
