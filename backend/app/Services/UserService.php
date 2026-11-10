<?php

namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{
    protected UserRepository $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    public function getAllUsers(?string $search = null, ?string $role = null, ?string $status = null): array
    {
        $users = $this->userRepo->all();

        // Remove passwords from list
        foreach ($users as &$user) {
            unset($user['password']);
        }

        if ($role && $role !== 'all') {
            $users = array_values(array_filter($users, function ($u) use ($role) {
                return strtolower($u['role']) === strtolower($role);
            }));
        }

        if ($status && $status !== 'all') {
            $users = array_values(array_filter($users, function ($u) use ($status) {
                return strtolower($u['status']) === strtolower($status);
            }));
        }

        if ($search) {
            $search = strtolower(trim($search));
            $users = array_values(array_filter($users, function ($u) use ($search) {
                return str_contains(strtolower($u['name']), $search) ||
                       str_contains(strtolower($u['email']), $search) ||
                       str_contains(strtolower($u['role']), $search);
            }));
        }

        return $users;
    }

    public function getUserById(string $id): ?array
    {
        $user = $this->userRepo->find($id);
        if ($user) {
            unset($user['password']);
        }
        return $user;
    }

    public function createUser(array $data): array
    {
        // Check duplicate email
        $existing = $this->userRepo->findByEmail($data['email']);
        if ($existing) {
            return [
                'success' => false,
                'message' => 'Email ' . $data['email'] . ' sudah terdaftar pada pengguna lain.',
                'status' => 422,
            ];
        }

        $newUser = $this->userRepo->create([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'] ?? 'password123',
            'role' => $data['role'] ?? 'Staff',
            'status' => $data['status'] ?? 'active',
            'phone' => trim($data['phone'] ?? ''),
            'avatar' => $data['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        ]);

        unset($newUser['password']);
        return [
            'success' => true,
            'message' => 'Pengguna baru berhasil ditambahkan.',
            'data' => $newUser,
            'status' => 201,
        ];
    }

    public function updateUser(string $id, array $data): array
    {
        $user = $this->userRepo->find($id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
                'status' => 404,
            ];
        }

        // Email uniqueness check
        if (isset($data['email']) && strtolower(trim($data['email'])) !== strtolower($user['email'])) {
            $duplicate = $this->userRepo->findByEmail($data['email']);
            if ($duplicate) {
                return [
                    'success' => false,
                    'message' => 'Email ' . $data['email'] . ' sudah digunakan oleh akun lain.',
                    'status' => 422,
                ];
            }
        }

        $updatePayload = [
            'name' => trim($data['name'] ?? $user['name']),
            'email' => isset($data['email']) ? strtolower(trim($data['email'])) : $user['email'],
            'role' => $data['role'] ?? $user['role'],
            'status' => $data['status'] ?? $user['status'],
            'phone' => trim($data['phone'] ?? ($user['phone'] ?? '')),
        ];

        if (!empty($data['password'])) {
            $updatePayload['password'] = $data['password'];
        }

        $updated = $this->userRepo->update($id, $updatePayload);
        unset($updated['password']);

        return [
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $updated,
            'status' => 200,
        ];
    }

    public function deleteUser(string $id, ?string $currentUserId = null): array
    {
        $user = $this->userRepo->find($id);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Pengguna tidak ditemukan.',
                'status' => 404,
            ];
        }

        if ($currentUserId && $user['id'] === $currentUserId) {
            return [
                'success' => false,
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.',
                'status' => 422,
            ];
        }

        // Check if last administrator
        if ($user['role'] === 'Administrator') {
            $all = $this->userRepo->all();
            $adminCount = 0;
            foreach ($all as $u) {
                if ($u['role'] === 'Administrator') {
                    $adminCount++;
                }
            }
            if ($adminCount <= 1) {
                return [
                    'success' => false,
                    'message' => 'Tidak dapat menghapus Administrator terakhir di sistem.',
                    'status' => 422,
                ];
            }
        }

        $this->userRepo->delete($id);

        return [
            'success' => true,
            'message' => 'Pengguna berhasil dihapus.',
            'status' => 200,
        ];
    }
}

