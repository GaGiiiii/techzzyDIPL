<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'username' => $this->username,
            'img' => $this->img,
            'email' => $this->email,
            'is_admin' => $this->is_admin,
            'ratings' => $this->ratings,
            'comments' => $this->comments,
            'cart' => $this->cart,
            'payments' => $this->payments
        ];
    }
}
