<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

class TestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/test",
     *     summary="Test Endpoint",
     *     tags={"Test"},
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function test()
    {
        return response()->json(['message' => 'Test success']);
    }
}
