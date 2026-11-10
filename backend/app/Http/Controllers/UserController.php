<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $role = $request->query('role');
        $status = $request->query('status');

        $users = $this->userService->getAllUsers($search, $role, $status);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pengguna berhasil dimuat.',
            'data' => $users,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail pengguna berhasil diambil.',
            'data' => $user,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = $request->input('name');
        $email = $request->input('email');
        $password = $request->input('password');

        $errors = [];
        if (empty($name)) {
            $errors['name'] = ['Nama lengkap pengguna wajib diisi.'];
        }
        if (empty($email)) {
            $errors['email'] = ['Alamat email wajib diisi.'];
        }
        if (empty($password)) {
            $errors['password'] = ['Kata sandi wajib diisi.'];
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data pengguna gagal.',
                'errors' => $errors,
            ], 422);
        }

        $result = $this->userService->createUser($request->all());

        return response()->json($result, $result['status'] ?? 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $result = $this->userService->updateUser($id, $request->all());

        return response()->json($result, $result['status'] ?? 200);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $currentUser = $request->attributes->get('auth_user');
        $currentUserId = $currentUser['id'] ?? null;

        $result = $this->userService->deleteUser($id, $currentUserId);

        return response()->json($result, $result['status'] ?? 200);
    }
}

