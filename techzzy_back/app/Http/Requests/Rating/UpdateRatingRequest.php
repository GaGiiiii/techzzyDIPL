<?php

namespace App\Http\Requests\Rating;

use App\Services\Rating\RatingService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateRatingRequest extends FormRequest
{
    private RatingService $ratingService;

    public function __construct(RatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->ratingM = $this->ratingService->getById($this->route('rating'));
        } catch (ModelNotFoundException $e) {
            $this->ratingM = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->ratingM);
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
            ]
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
