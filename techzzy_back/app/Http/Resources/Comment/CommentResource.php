<?php

namespace App\Http\Resources\Comment;

use App\Http\Resources\Product\ProductResource;
use App\Http\Resources\Rating\RatingResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'user' => new UserResource($this->user),
            'product' => new ProductResource($this->product),
            'body' => $this->body,
            'ratings' => RatingResource::collection($this->whenLoaded('ratings')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
