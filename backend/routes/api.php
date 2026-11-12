<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WasteController;
use App\Http\Middleware\DevelopmentAuthMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

Route::get('/status', function () {
    return response()->json([
        'status' => 'success',
        'connected' => true,
        'app_name' => 'SampahPay',
        'message' => 'Laravel REST API backend connected successfully.',
        'mode' => 'In-Memory Temporary Repository (Database-Free)',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Public Settings & Info
Route::get('/settings/public', [SettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Protected API Routes (Requires Token)
|--------------------------------------------------------------------------
*/
Route::middleware([DevelopmentAuthMiddleware::class])->group(function () {
    // Current Authenticated User Profile
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard Statistics & Visualizations
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])
        ->middleware(RoleMiddleware::class . ':Administrator');

    // Waste Management
    Route::get('/waste', [WasteController::class, 'index']);
    Route::get('/waste/{id}', [WasteController::class, 'show']);
    Route::post('/waste', [WasteController::class, 'store']);
    Route::put('/waste/{id}', [WasteController::class, 'update']);
    Route::delete('/waste/{id}', [WasteController::class, 'destroy'])
        ->middleware(RoleMiddleware::class . ':Administrator');

    // Customer Management
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])
        ->middleware(RoleMiddleware::class . ':Administrator');

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy'])
        ->middleware(RoleMiddleware::class . ':Administrator');

    // Reports & Analytics
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/summary', [ReportController::class, 'summary']);

    // User Management (Administrator Only)
    Route::middleware([RoleMiddleware::class . ':Administrator'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Settings (Admin only)
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
        Route::post('/settings/reset', [SettingController::class, 'resetData']);
    });
});
