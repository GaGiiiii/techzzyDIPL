<?php

namespace App\Http\Requests\Comment;

use App\Services\Comment\CommentService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UpdateCommentRequest extends FormRequest
{
    private CommentService $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->comment = $this->commentService->getById($this->comment);
        } catch (ModelNotFoundException $e) {
            $this->comment = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->comment);
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
            ]
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
