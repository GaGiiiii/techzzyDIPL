<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
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
Route::apiResource('ratings', RatingController::class);
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

Route::group(['middleware' => 'auth:sanctum'], function () {
  // Route::get('/products', [ProductController::class, 'index']);
  Route::post('/logout', [UserController::class, 'logout']);

  // Comments
  Route::post('/comments', [CommentController::class, 'store']);
  Route::put('/comments/{comment}', [CommentController::class, 'update']);
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
