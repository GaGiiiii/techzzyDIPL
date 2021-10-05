<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('/register', [UserController::class, 'register']);
Route::get('/loggedIn', [UserController::class, 'loggedIn']);

Route::group(['middleware' => 'auth:sanctum'], function () {
  Route::get('/register', [UserController::class, 'register']);
});


Route::get('/', function () {
  return view('welcome');
});
