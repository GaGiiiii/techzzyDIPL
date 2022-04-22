<?php

namespace App\Data\User;

use App\Models\Role;
use Illuminate\Http\Request;
use Spatie\DataTransferObject\DataTransferObject;

class UserData extends DataTransferObject
{
    public string $username;
    public string $first_name;
    public string $last_name;
    public string $email;
    public ?string $password;
    public mixed $img;
    public mixed $imgFile;

    public static function fromRequest(Request $request)
    {
        return new static([
            'username' => $request->username,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => $request->password,
            'img' => $request->img,
            'imgFile' => $request->file('img'),
        ]);
    }
}
