<?php

namespace App\Repositories;

class UserRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'users';
    protected string $idPrefix = 'USR';

    public function findByEmail(string $email): ?array
    {
        $users = $this->all();
        foreach ($users as $user) {
            if (isset($user['email']) && strtolower($user['email']) === strtolower(trim($email))) {
                return $user;
            }
        }
        return null;
    }

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'USR-001',
                'name' => 'Radhitya Dhimas Ardyansyah',
                'email' => 'admin@sampahpay.com',
                'password' => 'password123',
                'role' => 'Administrator',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'phone' => '+62 812-3456-7890',
                'created_at' => '2026-01-01T08:00:00Z',
                'updated_at' => '2026-01-01T08:00:00Z',
            ],
            [
                'id' => 'USR-002',
                'name' => 'Imania Ambarwati',
                'email' => 'staff@sampahpay.com',
                'password' => 'password123',
                'role' => 'Staff',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'phone' => '+62 813-9876-5432',
                'created_at' => '2026-01-15T09:30:00Z',
                'updated_at' => '2026-01-15T09:30:00Z',
            ],
            [
                'id' => 'USR-003',
                'name' => 'Andi Wijaya (Field Staff)',
                'email' => 'andi@sampahpay.com',
                'password' => 'password123',
                'role' => 'Staff',
                'status' => 'inactive',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'phone' => '+62 821-1234-5678',
                'created_at' => '2026-02-01T10:00:00Z',
                'updated_at' => '2026-02-01T10:00:00Z',
            ],
        ];
    }
}

