<?php

namespace App\Repositories;

class WasteRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'waste';
    protected string $idPrefix = 'WST';

    public function findByCategoryId(string $categoryId): array
    {
        $wasteItems = $this->all();
        return array_values(array_filter($wasteItems, function ($item) use ($categoryId) {
            return isset($item['category_id']) && $item['category_id'] === $categoryId;
        }));
    }

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'WST-001',
                'name' => 'Botol Plastik PET Bening',
                'category_id' => 'CAT-001',
                'description' => 'Botol air mineral bersih tanpa tutup dan label, dipres padat.',
                'price_per_kg' => 4500,
                'unit' => 'kg',
                'created_at' => '2026-01-10T08:00:00Z',
                'updated_at' => '2026-01-10T08:00:00Z',
            ],
            [
                'id' => 'WST-002',
                'name' => 'Botol Plastik HDPE (Jerigen / Sabun)',
                'category_id' => 'CAT-001',
                'description' => 'Jerigen minyak, botol sampo, botol detergen plastik tebal berwarna.',
                'price_per_kg' => 3800,
                'unit' => 'kg',
                'created_at' => '2026-01-10T08:15:00Z',
                'updated_at' => '2026-01-10T08:15:00Z',
            ],
            [
                'id' => 'WST-003',
                'name' => 'Gelas Plastik PP Bening',
                'category_id' => 'CAT-001',
                'description' => 'Cup minuman kopi kekinian, boba, dan jus plastik PP bersih tanpa sealer.',
                'price_per_kg' => 3200,
                'unit' => 'kg',
                'created_at' => '2026-01-10T08:30:00Z',
                'updated_at' => '2026-01-10T08:30:00Z',
            ],
            [
                'id' => 'WST-004',
                'name' => 'Kardus Bekas Gelombang',
                'category_id' => 'CAT-002',
                'description' => 'Kardus kemasan coklat kering, dilipat rapi bebas isolasi berlebih.',
                'price_per_kg' => 2200,
                'unit' => 'kg',
                'created_at' => '2026-01-11T09:00:00Z',
                'updated_at' => '2026-01-11T09:00:00Z',
            ],
            [
                'id' => 'WST-005',
                'name' => 'Kertas Arsip Putih / HVS',
                'category_id' => 'CAT-002',
                'description' => 'Kertas dokumen HVS putih tanpa staples, buku catatan, dan kertas print.',
                'price_per_kg' => 2800,
                'unit' => 'kg',
                'created_at' => '2026-01-11T09:30:00Z',
                'updated_at' => '2026-01-11T09:30:00Z',
            ],
            [
                'id' => 'WST-006',
                'name' => 'Kaleng Minuman Alumunium',
                'category_id' => 'CAT-003',
                'description' => 'Kaleng minuman ringan soda/larutan berbahan murni alumunium.',
                'price_per_kg' => 14000,
                'unit' => 'kg',
                'created_at' => '2026-01-12T10:00:00Z',
                'updated_at' => '2026-01-12T10:00:00Z',
            ],
            [
                'id' => 'WST-007',
                'name' => 'Besi Scrap Padu & Seng',
                'category_id' => 'CAT-003',
                'description' => 'Potongan besi konstruksi, paku, seng bekas, dan plat logam.',
                'price_per_kg' => 5500,
                'unit' => 'kg',
                'created_at' => '2026-01-12T10:30:00Z',
                'updated_at' => '2026-01-12T10:30:00Z',
            ],
            [
                'id' => 'WST-008',
                'name' => 'Botol Kaca Utuh & Bersih',
                'category_id' => 'CAT-004',
                'description' => 'Botol kecap, sirup, dan minuman kaca utuh tidak retak.',
                'price_per_kg' => 1200,
                'unit' => 'kg',
                'created_at' => '2026-01-13T11:00:00Z',
                'updated_at' => '2026-01-13T11:00:00Z',
            ],
            [
                'id' => 'WST-009',
                'name' => 'Sampah Organik Dapur & Daun',
                'category_id' => 'CAT-005',
                'description' => 'Sisa sayuran, sisa nasi, ampas kelapa, dan potongan dedaunan taman.',
                'price_per_kg' => 800,
                'unit' => 'kg',
                'created_at' => '2026-01-13T11:30:00Z',
                'updated_at' => '2026-01-13T11:30:00Z',
            ],
            [
                'id' => 'WST-010',
                'name' => 'Minyak Jelantah Saring Bersih',
                'category_id' => 'CAT-006',
                'description' => 'Minyak goreng bekas pakai yang telah disaring bebas sisa remahan makanan.',
                'price_per_kg' => 7500,
                'unit' => 'kg',
                'created_at' => '2026-01-14T12:00:00Z',
                'updated_at' => '2026-01-14T12:00:00Z',
            ],
        ];
    }
}

