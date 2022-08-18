<?php

namespace App\Services\User;

use App\Data\User\UserData;
use App\Models\Cart;
use App\Models\ProductCart;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserService
{

    /**
     * Retrieves all the categories.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return User::all();
    }

    /**
     * Retrieves single User.
     *
     * @param int $id
     * @return User
     * @throws ModelNotFoundException
     */
    public function getById(int $id): ?User
    {
        return User::findOrFail($id);
    }

    /**
     * Creates a new User.
     *
     * @param UserData $userData
     * @return array
     */
    public function create(UserData $userData): array
    {
        $user = new User();
        $userData->password = Hash::make($userData->password);

        // CHECK IF IMAGE IS UPLOADED
        if (isset($userData->img)) {
            // CREATE UNIQUE FILENAME AND STORE IT UNIQUE FOLDER
            $fileName = $userData->username . "_" . date('dmY_Hs') . "." . $userData->img->extension() ?? null;
            $path = $userData->imgFile->storeAs('avatars/' . $userData->username, $fileName);
            $userData->img = $fileName;

            Log::debug([$fileName, $path]);
        }

        $user = $user->create($userData->toArray());

        $cart = new Cart();
        $cart->user_id = $user->id;
        $cart->save();
        $token = $user->createToken('usertoken');

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Updates a existing User.
     *
     * @param UserData $userData
     * @param User|null $user
     * @return User
     * @throws ModelNotFoundException
     */
    public function update(UserData $userData, ?User $user): User
    {
        if ($user === null) {
            throw new ModelNotFoundException();
        }

        // CHECK IF IMAGE IS UPLOADED
        if (isset($userData->img)) {
            // DELETE OLD USER PHOTO
            Storage::deleteDirectory('avatars/' .  auth()->user()->username);

            // CREATE UNIQUE FILENAME AND STORE IT UNIQUE FOLDER
            $fileName = auth()->user()->username . "_" . date('dmY_Hs') . "." . $userData->img->extension() ?? null;
            $path = $userData->imgFile->storeAs('avatars/' . auth()->user()->username, $fileName);
            $userData->img = $fileName;
        }

        if ($userData->password === null) {
            $user->update($userData->except('password', isset($userData->img) ? '' : 'img')->toArray());

            return $user->fresh([
                'comments',
                'comments.product',
                'ratings',
                'ratings.product',
                'cart',
                'cart.productCarts'
            ]);
        }

        $userData->password = Hash::make($userData->password);
        $user->update($userData->except(isset($userData->img) ? '' : 'img')->toArray());

        return $user->fresh([
            'comments',
            'comments.product',
            'ratings',
            'ratings.product',
            'cart',
            'cart.productCarts'
        ]);
    }

    /**
     * Deletes a existing User.
     *
     * @param User $user
     * @return User
     */
    public function delete(?User $user): User
    {
        if ($user === null) {
            throw new ModelNotFoundException();
        }

        $user->delete();

        return $user;
    }

    /**
     * Logs in a existing User.
     *
     * @param string $email
     * @param string $password
     * @return array
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return [];
        }

        $token = $user->createToken('usertoken');
        $user = $user->fresh([
            'comments',
            'comments.product',
            'ratings',
            'ratings.product',
            'cart',
            'cart.productCarts'
        ]);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Logs out a existing User.
     *
     * @return User
     */
    public function logout(): User
    {
        $user = auth()->user();
        $user->tokens()->delete();

        return $user;
    }

    /**
     * Logs out a existing User.
     *
     * @return Collection
     */
    public function getAllPayments(int $user_id): Collection
    {
        $users = User::with(['payments', 'payments.paymentProducts', 'payments.paymentProducts.product'])
            ->where('id', $user_id)->get();
        $payments = $users[0]['payments'];

        return $payments;
    }

    /**
     * Logs out a existing User.
     *
     * @return array
     */
    public function getAllProductsInCart(int $user_id): array
    {
        $user = User::find($user_id);
        $pcs = ProductCart::with('product', 'product.ratings', 'product.category')
            ->where('cart_id', $user->cart->id)->get();
        $products = [];

        foreach ($pcs as $pc) {
            $product = $pc['product'];
            $product->count = $pc->count;
            $product->pcID = $pc->id;
            array_push($products, $product);
        }

        return $products;
    }
}
