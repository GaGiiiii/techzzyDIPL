<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory {
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = Comment::class;

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
      'body' => $this->faker->text('1000'),
    ];
  }
}
