<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema; 
use Illuminate\Support\Facades\Http;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        $discoveryServerUrl = env('DISCOVERY_SERVER_URL', 'http://172.16.1.224:8061/eureka/'); // Replace with actual Discovery Server URL

        Http::post("{$discoveryServerUrl}/register", [
            'name' => 'dao-laravel-backend',
            'url' => config('app.url'),
            'healthcheck' => config('app.url') . '/api/health',
        ]);
    }
}
