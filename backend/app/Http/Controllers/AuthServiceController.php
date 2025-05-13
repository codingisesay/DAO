<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthServiceController extends Controller
{
    public function getAuthServiceUrl()
    {
        $discoveryServerUrl = env('DISCOVERY_SERVER_URL', 'http://172.16.1.224:8061/eureka/');
        $response = Http::get("{$discoveryServerUrl}/lookup/auth-service");

        if ($response->successful()) {
            return $response->json()['url']; // e.g., http://auth-service.local/api
        }

        return null;
    }
}
