<?php

namespace App\Http\Resources\Product;

use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\Comment\CommentResource;
use App\Http\Resources\Rating\RatingResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'category' => new CategoryResource($this->category),
            'name' => $this->name,
            'desc' => $this->desc,
            'img' => $this->img,
            'stock' => $this->stock,
            'price' => $this->price,
            'ratings' => RatingResource::collection($this->whenLoaded('ratings')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            // return $product->fresh(['ratings', 'comments', 'category', 'comments.user']); TODO TO DO
        ];
    }
}
