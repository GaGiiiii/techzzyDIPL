<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProductCartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::apiResource('users', UserController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('carts', CartController::class);

// Comments
Route::get('/comments', [CommentController::class, 'index']);
Route::get('/comments/{comment}', [CommentController::class, 'show']);

// Auth
Route::post('/login', [UserController::class, 'login']);
Route::get('/register', [UserController::class, 'register']);
Route::get('/loggedIn', [UserController::class, 'loggedIn']);

// Ratings
Route::get('/ratings', [RatingController::class, 'index']);

// PROTECTED ==================================================
Route::group(['middleware' => 'auth:sanctum'], function () {
  // Route::get('/products', [ProductController::class, 'index']);
  Route::post('/logout', [UserController::class, 'logout']);

  // Comments
  Route::post('/comments', [CommentController::class, 'store']);
  Route::put('/comments/{comment}', [CommentController::class, 'update']);
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  // Users
  Route::get('/users/{user}/cart', [UserController::class, 'getAllProductsInCart']);

  // ProductCart
  Route::post('/product_carts', [ProductCartController::class, 'store']);
  Route::put('/product_carts/{product_cart}', [ProductCartController::class, 'update']);
  Route::delete('/product_carts/{product_cart}', [ProductCartController::class, 'destroy']);

  // Ratings
  Route::post('/ratings', [RatingController::class, 'store']);
  Route::put('/ratings/{rating}', [RatingController::class, 'update']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
