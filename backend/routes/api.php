<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and are prefixed with /api.
|
*/

Route::get('/status', function () {
    return response()->json([
        'status' => 'success',
        'connected' => true,
        'message' => 'Laravel backend is successfully connected with React frontend!',
        'laravel_version' => app()->version(),
        'php_version' => PHP_VERSION,
        'environment' => config('app.env'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'uptime' => 'operational',
    ]);
});

