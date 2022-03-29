<?php

namespace App\Http\Requests\Comment;

use App\Services\Comment\CommentService;
use Illuminate\Foundation\Http\FormRequest;

class DeleteCommentRequest extends FormRequest
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

        return auth()->check() && auth()->user()->can('forceDelete', $this->comment);
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
