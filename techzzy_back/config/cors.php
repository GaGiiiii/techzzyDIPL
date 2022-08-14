<?php

return [

  /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

  'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'loggedIn'],

  'allowed_methods' => ['*'],

  'allowed_origins' => ['*'],
  
  // 'allowed_origins' => [
  //   'localhost', 'http://localhost', 'localhost:3000', 'http://localhost:3000', 'localhost:8000', 'http://localhost:8000',
  //   '127.0.0.1:3000', 'http://127.0.0.1:3000'
  // ],

  'allowed_origins_patterns' => [],

  'allowed_headers' => ['*'],

  'exposed_headers' => [],

  'max_age' => 0,

  'supports_credentials' => true,

];
