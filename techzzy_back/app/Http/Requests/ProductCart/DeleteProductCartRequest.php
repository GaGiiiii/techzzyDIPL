<?php

namespace App\Http\Requests\ProductCart;

use App\Services\ProductCart\ProductCartService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;

class DeleteProductCartRequest extends FormRequest
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

        return auth()->check() && auth()->user()->can('forceDelete', $this->product_cart);
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
