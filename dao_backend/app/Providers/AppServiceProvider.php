<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\EurekaService;
use Illuminate\Support\Facades\Schema; 


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
    public function boot()
    {
        Schema::defaultStringLength(191);
        // app(EurekaService::class)->register();
    
        // Optionally schedule heartbeats using Laravel scheduler
    }
}
