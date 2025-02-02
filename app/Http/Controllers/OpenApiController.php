<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="KODIGO APP FINAL API",
 *     version="1.0.0",
 *     description="Full API documentation"
 * )
 * 
 * @OA\PathItem(path="/")
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class OpenApiController extends Controller
{
    // Placeholder for Swagger annotations
}