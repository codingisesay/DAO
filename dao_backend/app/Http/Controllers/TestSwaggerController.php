<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class TestSwaggerController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/test-swagger",
     *     summary="Testing",
     *     tags={"Swagger Test"},
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     )
     * )
     */
    public function test()
    {
        return response()->json(['message' => 'Swagger is working']);
    }
}
