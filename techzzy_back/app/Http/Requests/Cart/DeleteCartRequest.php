<?php

namespace App\Http\Requests\Cart;

use App\Services\Cart\CartService;
use Illuminate\Foundation\Http\FormRequest;

class DeleteCartRequest extends FormRequest
{
    private CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->CartService = $cartService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->cart = $this->cartService->getById($this->cart);
        } catch (ModelNotFoundException $e) {
            $this->cart = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('forceDelete', $this->cart);
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
