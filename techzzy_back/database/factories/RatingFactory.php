<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RatingFactory extends Factory {
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = Rating::class;

  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition() {
    $users = User::all();
    $products = Product::all();

    return [
      'product_id' => $products[rand(0, sizeof($products) - 1)],
      'user_id' => $users[rand(0, sizeof($users) - 1)],
      'rating' => rand(1, 10),
    ];
  }
}
