<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductCartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
});

// Comments
Route::get('/comments', [CommentController::class, 'index']);
Route::get('/comments/{comment}', [CommentController::class, 'show']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/category/{category}', [CategoryController::class, 'show']);

// Auth
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::get('/loggedIn', [UserController::class, 'loggedIn']);

// Ratings
Route::get('/ratings', [RatingController::class, 'index']);

// NestPay
Route::post('/nestpay/success', [PaymentController::class, 'nestpaySuccess']);
Route::post('/nestpay/fail', [PaymentController::class, 'nestpayFail']);
Route::get('/nestpay/fail', [PaymentController::class, 'nestpayFail']);

// PROTECTED ==================================================
Route::group(['middleware' => 'auth:sanctum'], function () {
    // Auth
    Route::post('/logout', [UserController::class, 'logout']);

    // Comments
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}/cart', [UserController::class, 'getAllProductsInCart']);
    Route::get('/users/{user}/payments', [UserController::class, 'getAllPayments']);
    Route::put('/users/{user}', [UserController::class, 'update']);

    // ProductCart
    Route::post('/product_carts', [ProductCartController::class, 'store']);
    Route::put('/product_carts/{product_cart}', [ProductCartController::class, 'update']);
    Route::delete('/product_carts/{product_cart}', [ProductCartController::class, 'destroy']);

    // Ratings
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::put('/ratings/{rating}', [RatingController::class, 'update']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
});
// PROTECTED ==================================================



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
