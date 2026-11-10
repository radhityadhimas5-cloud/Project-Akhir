<?php

namespace App\Services;

use App\Repositories\UserRepository;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Email atau kata sandi tidak ditemukan.',
                'status' => 401,
            ];
        }

        if ($user['password'] !== $password && !password_verify($password, $user['password'])) {
            return [
                'success' => false,
                'message' => 'Kata sandi yang Anda masukkan salah.',
                'status' => 401,
            ];
        }

        if (isset($user['status']) && $user['status'] !== 'active') {
            return [
                'success' => false,
                'message' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi Administrator.',
                'status' => 403,
            ];
        }

        // Generate temporary development token
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name'],
            'timestamp' => time(),
        ];
        $token = 'dev_token_' . base64_encode(json_encode($payload));

        $safeUser = $user;
        unset($safeUser['password']);

        return [
            'success' => true,
            'message' => 'Login berhasil! Selamat datang kembali, ' . $user['name'],
            'data' => [
                'token' => $token,
                'user' => $safeUser,
            ],
            'status' => 200,
        ];
    }

    public function getUserFromToken(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        if (!str_starts_with($token, 'dev_token_')) {
            return null;
        }

        $encoded = substr($token, 10);
        $json = base64_decode($encoded);
        $payload = json_decode($json, true);

        if (!$payload || !isset($payload['id'])) {
            return null;
        }

        $user = $this->userRepository->find($payload['id']);
        if (!$user || ($user['status'] ?? '') !== 'active') {
            return null;
        }

        unset($user['password']);
        return $user;
    }
}

