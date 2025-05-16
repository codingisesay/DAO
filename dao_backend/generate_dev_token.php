<?php

use Firebase\JWT\JWT;

require 'vendor/autoload.php';

$roles = ['admin', 'agent', 'employee'];
$secret = 'dev_secret_key';

foreach ($roles as $i => $role) {
    $payload = [
        'sub' => $i + 1,
        'email' => "$role@example.com",
        'name' => ucfirst($role) . ' User',
        'role' => $role,
        'exp' => time() + (60 * 60 * 8),
    ];

    $jwt = JWT::encode($payload, $secret, 'HS256');
    echo strtoupper($role) . " TOKEN:\n$jwt\n\n";
}
