<?php

namespace App\Http\Requests\User;

use App\Services\User\UserService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class UpdateUserRequest extends FormRequest
{

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        try {
            $this->user = $this->userService->getById($this->user);
        } catch (ModelNotFoundException $e) {
            $this->user = null;

            return true;
        }

        return auth()->check() && auth()->user()->can('update', $this->user);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|alpha|max:255',
            'last_name' => 'required|alpha|max:255',
            'username' => 'required|alpha_dash|max:255|unique:users,username,' . auth()->user()->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . auth()->user()->id,
            'img' => 'image|file|max:5000',
            'password' => 'nullable|min:6|confirmed',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'user' => null,
            'message' => 'Validation failed.',
            'errors' => $validator->messages(),
        ], 400);

        throw new ValidationException($validator, $response);
    }
}
