<?php

namespace App\Http\Requests\User;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return !auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|alpha|min:2',
            'last_name' => 'required|alpha|min:2',
            'username' => 'required|alpha_dash|min:2|unique:users,username',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'img' => 'file|image|max:5000',
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
