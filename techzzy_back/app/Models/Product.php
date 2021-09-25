<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
  use HasFactory;

  protected $fillable = [
    'category_id',
    'name',
    'desc',
    'img',
    'stock',
    'price',
  ];

  public function ratings() {
    return $this->hasMany(Rating::class);
  }

  public function comments() {
    return $this->hasMany(Comment::class);
  }

  public function category() {
    return $this->hasOne(Category::class);
  }

  public function productCarts() {
    return $this->hasMany(ProductCart::class);
  }
}
