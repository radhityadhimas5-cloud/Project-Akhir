<?php

namespace App\Http\Middleware;

use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;

class DevelopmentAuthMiddleware
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (!$header) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Token otentikasi tidak ditemukan. Silakan login kembali.',
            ], 401);
        }

        $user = $this->authService->getUserFromToken($header);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi Anda telah kedaluwarsa atau tidak valid. Silakan login kembali.',
            ], 401);
        }

        // Attach authenticated user to request attributes
        $request->attributes->set('auth_user', $user);

        return $next($request);
    }
}

