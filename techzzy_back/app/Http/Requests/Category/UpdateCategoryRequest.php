<?php

namespace App\Http\Requests\Category;

use App\Services\Category\CategoryService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class UpdateCategoryRequest extends FormRequest
{
    private CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->category = $this->categoryService->getById($this->category);
        } catch (ModelNotFoundException $e) {
            $this->category = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->category);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|min:2|max:100',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'category' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
        ], 400);

        throw new ValidationException($validator, $response);
    }
}
