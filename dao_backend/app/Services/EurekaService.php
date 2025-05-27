<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EurekaService
{
    protected $eurekaUrl;
    protected $appName;
    protected $instanceId;
    protected $hostName;
    protected $port;

    public function __construct()
    {
        // $this->eurekaUrl = config('eureka.url'); // e.g., http://localhost:8761/eureka
        //   $this->eurekaUrl = config('EUREKA_SERVER'); 
        
        $this->eurekaUrl = 'http://172.16.1.224:8061/eureka';
        $this->appName = config('app.name');
        //  $this->instanceId = gethostbyname(gethostname()) . ':' . $this->appName . ':' . config('app.port');
        $this->instanceId = 'stpl' . ':' . $this->appName . ':' . config('app.port');
        $this->hostName = gethostname();
        $this->port = config('app.port');
    }

    public function register()
    {
        $body = [
            'instance' => [
                'instanceId' => $this->instanceId,
                //   'instanceId' => 'stpl',
                'hostName' => $this->hostName,
                'app' => $this->appName,
                // 'ipAddr' => gethostbyname(gethostname()),
                'ipAddr' => '127.0.0.1',
                'status' => 'UP',
                'port' => [
                    '$' => $this->port,
                    '@enabled' => 'true'
                ],
                'dataCenterInfo' => [
                    '@class' => 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    'name' => 'MyOwn'
                ]
            ]
        ];

        // dd($body);

        return Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post("{$this->eurekaUrl}/apps/{$this->appName}", $body);
    }

    public function sendHeartbeat()
    {
        return Http::put("{$this->eurekaUrl}/apps/{$this->appName}/{$this->instanceId}");
    }

    public function deregister()
    {
        return Http::delete("{$this->eurekaUrl}/apps/{$this->appName}/{$this->instanceId}");
    }
}
