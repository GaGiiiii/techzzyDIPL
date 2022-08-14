<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider {
  /**
   * The policy mappings for the application.
   *
   * @var array
   */
  protected $policies = [
    'App\Models\Category' => 'App\Policies\CategoryPolicy',
    'App\Models\Comment' => 'App\Policies\CommentPolicy',
    'App\Models\Payment' => 'App\Policies\PaymentPolicy',
    'App\Models\PaymentProduct' => 'App\Policies\PaymentProductPolicy',
    'App\Models\ProductCart' => 'App\Policies\ProductCartPolicy',
    'App\Models\Product' => 'App\Policies\ProductPolicy',
    'App\Models\Rating' => 'App\Policies\RatingPolicy',
    'App\Models\User' => 'App\Policies\UserPolicy',
  ];

  /**
   * Register any authentication / authorization services.
   *
   * @return void
   */
  public function boot() {
    $this->registerPolicies();

    //
  }
}
