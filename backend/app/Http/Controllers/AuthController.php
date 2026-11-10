<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request): JsonResponse
    {
        $email = $request->input('email') ?? $request->json('email');
        $password = $request->input('password') ?? $request->json('password');

        if (empty($email) || empty($password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email dan kata sandi wajib diisi.',
                'errors' => [
                    'email' => empty($email) ? ['Email wajib diisi.'] : [],
                    'password' => empty($password) ? ['Kata sandi wajib diisi.'] : [],
                ],
            ], 422);
        }

        $result = $this->authService->login($email, $password);

        return response()->json($result, $result['status'] ?? 200);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak terautentikasi.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data profil berhasil diambil.',
            'data' => $user,
        ]);
    }

    public function logout(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Anda telah berhasil keluar (logout) dari sistem.',
        ]);
    }
}
