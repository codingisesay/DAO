<?php

// return [

//     /*
//     |--------------------------------------------------------------------------
//     | Cross-Origin Resource Sharing (CORS) Configuration
//     |--------------------------------------------------------------------------
//     |
//     | Here you may configure your settings for cross-origin resource sharing
//     | or "CORS". This determines what cross-origin operations may execute
//     | in web browsers. You are free to adjust these settings as needed.
//     |
//     | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
//     |
//     */

//     'paths' => ['api/*', 'sanctum/csrf-cookie','http://localhost:5173/'],

//     'allowed_methods' => ['*','http://localhost:5173/'],

//     'allowed_origins' => ['*','http://localhost:5173/'],

//     'allowed_origins_patterns' => ['http://localhost:5173/'],

//     'allowed_headers' => ['*','http://localhost:5173/'],

//     'exposed_headers' => ['http://localhost:5173/'],

//     'max_age' => 0,

//     'supports_credentials' => false,

// ];

return [

    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false, // If using cookies/session

];




