<?php

namespace App\Http\Controllers;

use App\Data\User\UserData;
use App\Http\Requests\User\GetAllUserPaymentsRequest;
use App\Http\Requests\User\GetAllUsersRequest;
use App\Http\Requests\User\GetUsersProductsInCartRequest;
use App\Http\Requests\User\LoginUserRequest;
use App\Http\Requests\User\RegisterUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\Cart;
use App\Models\ProductCart;
use App\Models\User;
use App\Services\User\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param GetAllUsersRequest $request
     * @return \Illuminate\Http\Response
     */
    public function index(GetAllUsersRequest $request)
    {
        try {
            $users = $this->userService->getAll();
        } catch (QueryException $e) {
            return response()->json([
                "users" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "users" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response()->json([
            "users" => UserResource::collection($users),
            "message" => "Users found.",
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateUserRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $user = $this->userService->update(UserData::fromRequest($request), $request->user);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                "user" => null,
                "message" => "User not found.",
            ], 404);
        }

        return response([
            "user" => new UserResource($user),
            "message" => "User updated.",
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param LoginUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function login(LoginUserRequest $request)
    {
        try {
            $loginArr = $this->userService->login($request->email, $request->password);
        } catch (QueryException $e) {
            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        }

        if (empty($loginArr)) {
            return response([
                "user" => null,
                "message" => "Login failed.",
            ], 401);
        }

        return response([
            "user" => $loginArr['user'],
            "message" => "Login successful",
            'token' => $loginArr['token']->plainTextToken,
        ], 200);
    }

    public function logout(Request $request)
    {
        try {
            $user = $this->userService->logout();
        } catch (QueryException $e) {
            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "user" => $user,
            "message" => "Logout successful.",
        ], 200);
    }

    public function register(RegisterUserRequest $request)
    {
        try {
            $registerArr = $this->userService->create(UserData::fromRequest($request));
        } catch (QueryException $e) {
            Log::error('Create User Query Error', [$e->getMessage()]);

            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            Log::error('Create User Exception Error', [$e->getMessage()]);

            return response()->json([
                "user" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "user" => $registerArr['user'],
            "message" => "User created.",
            'token' => $registerArr['token']->plainTextToken,
        ], 201);
    }

    public function loggedIn()
    {
        if (auth()->user()) {
            return response([
                "user" => auth()->user(),
                "message" => "User logged in.",
            ], 200);
        }

        return response([
            "user" => null,
            "message" => "Not logged in.",
        ], 401);
    }

    public function getAllProductsInCart(GetUsersProductsInCartRequest $request, int $user_id)
    {
        try {
            $products = $this->userService->getAllProductsInCart($user_id);
        } catch (QueryException $e) {
            Log::error('Get Products In Cart Query Error', [$e->getMessage()]);

            return response()->json([
                "products" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            Log::error('Get Products In Cart Exception Error', [$e->getMessage()]);

            return response()->json([
                "products" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "products" => $products,
            "message" => "Products found",
        ], 200);
    }

    public function getAllPayments(GetAllUserPaymentsRequest $request, $user_id)
    {
        try {
            $payments = $this->userService->getAllPayments($user_id);
        } catch (QueryException $e) {
            Log::error('Create User Query Error', [$e->getMessage()]);

            return response()->json([
                "payments" => null,
                "message" => "Server Error",
            ], 500);
        } catch (Exception $e) {
            Log::error('Create User Exception Error', [$e->getMessage()]);

            return response()->json([
                "payments" => null,
                "message" => "Server Error",
            ], 500);
        }

        return response([
            "payments" => $payments,
            "message" => "Payments found",
        ], 200);
    }

    public function isAdmin()
    {
        return auth()->user()->is_admin;
    }
}
