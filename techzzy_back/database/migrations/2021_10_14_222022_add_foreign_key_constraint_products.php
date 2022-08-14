<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyConstraintProducts extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up() {
    Schema::table('products', function (Blueprint $table) {
      $table->unsignedBigInteger('category_id')->change();
      $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
    });

    Schema::table('comments', function (Blueprint $table) {
      $table->unsignedBigInteger('user_id')->change();
      $table->unsignedBigInteger('product_id')->change();
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });

    Schema::table('ratings', function (Blueprint $table) {
      $table->unsignedBigInteger('user_id')->change();
      $table->unsignedBigInteger('product_id')->change();
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });

    Schema::table('product_carts', function (Blueprint $table) {
      $table->unsignedBigInteger('cart_id')->change();
      $table->unsignedBigInteger('product_id')->change();
      $table->foreign('cart_id')->references('id')->on('carts')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });

    Schema::table('payment_products', function (Blueprint $table) {
      $table->unsignedBigInteger('payment_id')->change();
      $table->unsignedBigInteger('product_id')->change();
      $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });

    Schema::table('payments', function (Blueprint $table) {
      $table->unsignedBigInteger('user_id')->change();
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down() {
    Schema::table('products', function (Blueprint $table) {
      $table->dropForeign('category_id');
    });

    Schema::table('comments', function (Blueprint $table) {
      $table->dropForeign('user_id');
      $table->dropForeign('product_id');
    });

    Schema::table('ratings', function (Blueprint $table) {
      $table->dropForeign('user_id');
      $table->dropForeign('product_id');
    });

    Schema::table('product_carts', function (Blueprint $table) {
      $table->dropForeign('cart_id');
      $table->dropForeign('product_id');
    });

    Schema::table('payment_products', function (Blueprint $table) {
      $table->dropForeign('payment_id');
      $table->dropForeign('product_id');
    });

    Schema::table('payments', function (Blueprint $table) {
      $table->dropForeign('user_id');
    });
  }
}
