<?php

namespace App\Repositories;

class CategoryRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'categories';
    protected string $idPrefix = 'CAT';

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'CAT-001',
                'name' => 'Plastik',
                'description' => 'Berbagai macam limbah material plastik seperti PETE, HDPE, PP, dan kantong kemasan plastik daur ulang.',
                'color' => '#10B981', // Emerald
                'icon' => 'recycle',
                'created_at' => '2026-01-05T08:00:00Z',
                'updated_at' => '2026-01-05T08:00:00Z',
            ],
            [
                'id' => 'CAT-002',
                'name' => 'Kertas & Karton',
                'description' => 'Kardus coklat, kertas HVS putih, buku, majalah, arsip kantor, koran bekas berkualitas.',
                'color' => '#F59E0B', // Amber
                'icon' => 'file-text',
                'created_at' => '2026-01-05T08:30:00Z',
                'updated_at' => '2026-01-05T08:30:00Z',
            ],
            [
                'id' => 'CAT-003',
                'name' => 'Logam & Besi',
                'description' => 'Kaleng minuman aluminium, besi scrap, pipa logam, kuningan, tembaga, dan seng.',
                'color' => '#6366F1', // Indigo
                'icon' => 'hammer',
                'created_at' => '2026-01-06T09:00:00Z',
                'updated_at' => '2026-01-06T09:00:00Z',
            ],
            [
                'id' => 'CAT-004',
                'name' => 'Kaca',
                'description' => 'Botol kecap, toples kaca bening/coklat, pecahan kaca bening yang dipisahkan aman.',
                'color' => '#06B6D4', // Cyan
                'icon' => 'glass-water',
                'created_at' => '2026-01-06T10:00:00Z',
                'updated_at' => '2026-01-06T10:00:00Z',
            ],
            [
                'id' => 'CAT-005',
                'name' => 'Organik',
                'description' => 'Sisa makanan, sayuran, dedaunan, kulit buah untuk pakan maggot BSF & pupuk kompos cair.',
                'color' => '#84CC16', // Lime
                'icon' => 'leaf',
                'created_at' => '2026-01-07T11:00:00Z',
                'updated_at' => '2026-01-07T11:00:00Z',
            ],
            [
                'id' => 'CAT-006',
                'name' => 'Minyak Jelantah',
                'description' => 'Minyak goreng bekas pakai rumah tangga, warung kuliner, dan restoran untuk bahan baku biodiesel.',
                'color' => '#D97706', // Yellow/Amber
                'icon' => 'droplet',
                'created_at' => '2026-01-08T13:00:00Z',
                'updated_at' => '2026-01-08T13:00:00Z',
            ],
        ];
    }
}

