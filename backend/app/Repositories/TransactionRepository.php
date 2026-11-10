<?php

namespace App\Repositories;

class TransactionRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'transactions';
    protected string $idPrefix = 'TRX';

    public function findByCustomerId(string $customerId): array
    {
        $transactions = $this->all();
        return array_values(array_filter($transactions, function ($trx) use ($customerId) {
            return isset($trx['customer_id']) && $trx['customer_id'] === $customerId;
        }));
    }

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'TRX-001',
                'customer_id' => 'CUST-001',
                'customer_name' => 'Ahmad Fauzi',
                'staff_id' => 'USR-001',
                'staff_name' => 'Budi Pratama',
                'date' => '2026-03-01T09:30:00Z',
                'items' => [
                    [
                        'waste_id' => 'WST-001',
                        'waste_name' => 'Botol Plastik PET Bening',
                        'category_id' => 'CAT-001',
                        'category_name' => 'Plastik',
                        'weight' => 12.5,
                        'price_per_kg' => 4500,
                        'subtotal' => 56250,
                    ],
                    [
                        'waste_id' => 'WST-004',
                        'waste_name' => 'Kardus Bekas Gelombang',
                        'category_id' => 'CAT-002',
                        'category_name' => 'Kertas & Karton',
                        'weight' => 20.0,
                        'price_per_kg' => 2200,
                        'subtotal' => 44000,
                    ],
                ],
                'total_weight' => 32.5,
                'total_amount' => 100250,
                'status' => 'completed',
                'notes' => 'Penyetoran sampah rumah tangga berkala.',
                'created_at' => '2026-03-01T09:30:00Z',
                'updated_at' => '2026-03-01T09:30:00Z',
            ],
            [
                'id' => 'TRX-002',
                'customer_id' => 'CUST-003',
                'customer_name' => 'PT Berkah Hijau Mandiri',
                'staff_id' => 'USR-002',
                'staff_name' => 'Siti Rahma',
                'date' => '2026-03-02T14:15:00Z',
                'items' => [
                    [
                        'waste_id' => 'WST-006',
                        'waste_name' => 'Kaleng Minuman Alumunium',
                        'category_id' => 'CAT-003',
                        'category_name' => 'Logam & Besi',
                        'weight' => 35.0,
                        'price_per_kg' => 14000,
                        'subtotal' => 490000,
                    ],
                    [
                        'waste_id' => 'WST-007',
                        'waste_name' => 'Besi Scrap Padu & Seng',
                        'category_id' => 'CAT-003',
                        'category_name' => 'Logam & Besi',
                        'weight' => 80.0,
                        'price_per_kg' => 5500,
                        'subtotal' => 440000,
                    ],
                    [
                        'waste_id' => 'WST-005',
                        'waste_name' => 'Kertas Arsip Putih / HVS',
                        'category_id' => 'CAT-002',
                        'category_name' => 'Kertas & Karton',
                        'weight' => 50.0,
                        'price_per_kg' => 2800,
                        'subtotal' => 140000,
                    ],
                ],
                'total_weight' => 165.0,
                'total_amount' => 1070000,
                'status' => 'completed',
                'notes' => 'Pickup limbah kantor & pabrik bulanan.',
                'created_at' => '2026-03-02T14:15:00Z',
                'updated_at' => '2026-03-02T14:15:00Z',
            ],
            [
                'id' => 'TRX-003',
                'customer_id' => 'CUST-004',
                'customer_name' => 'Restoran Rasa Nusantara',
                'staff_id' => 'USR-002',
                'staff_name' => 'Siti Rahma',
                'date' => '2026-03-03T11:00:00Z',
                'items' => [
                    [
                        'waste_id' => 'WST-010',
                        'waste_name' => 'Minyak Jelantah Saring Bersih',
                        'category_id' => 'CAT-006',
                        'category_name' => 'Minyak Jelantah',
                        'weight' => 45.0,
                        'price_per_kg' => 7500,
                        'subtotal' => 337500,
                    ],
                    [
                        'waste_id' => 'WST-009',
                        'waste_name' => 'Sampah Organik Dapur & Daun',
                        'category_id' => 'CAT-005',
                        'category_name' => 'Organik',
                        'weight' => 60.0,
                        'price_per_kg' => 800,
                        'subtotal' => 48000,
                    ],
                ],
                'total_weight' => 105.0,
                'total_amount' => 385500,
                'status' => 'completed',
                'notes' => 'Setoran minyak jelantah saring & limbah dapur restoran.',
                'created_at' => '2026-03-03T11:00:00Z',
                'updated_at' => '2026-03-03T11:00:00Z',
            ],
            [
                'id' => 'TRX-004',
                'customer_id' => 'CUST-002',
                'customer_name' => 'Dewi Sartika',
                'staff_id' => 'USR-001',
                'staff_name' => 'Budi Pratama',
                'date' => '2026-03-04T10:20:00Z',
                'items' => [
                    [
                        'waste_id' => 'WST-002',
                        'waste_name' => 'Botol Plastik HDPE (Jerigen / Sabun)',
                        'category_id' => 'CAT-001',
                        'category_name' => 'Plastik',
                        'weight' => 8.0,
                        'price_per_kg' => 3800,
                        'subtotal' => 30400,
                    ],
                    [
                        'waste_id' => 'WST-008',
                        'waste_name' => 'Botol Kaca Utuh & Bersih',
                        'category_id' => 'CAT-004',
                        'category_name' => 'Kaca',
                        'weight' => 15.0,
                        'price_per_kg' => 1200,
                        'subtotal' => 18000,
                    ],
                ],
                'total_weight' => 23.0,
                'total_amount' => 48400,
                'status' => 'completed',
                'notes' => 'Penyetoran botol kaca & plastik rumah tangga.',
                'created_at' => '2026-03-04T10:20:00Z',
                'updated_at' => '2026-03-04T10:20:00Z',
            ],
            [
                'id' => 'TRX-005',
                'customer_id' => 'CUST-005',
                'customer_name' => 'Hendra Kusuma (Bank Sampah Unit RW 08)',
                'staff_id' => 'USR-002',
                'staff_name' => 'Siti Rahma',
                'date' => '2026-03-05T15:40:00Z',
                'items' => [
                    [
                        'waste_id' => 'WST-001',
                        'waste_name' => 'Botol Plastik PET Bening',
                        'category_id' => 'CAT-001',
                        'category_name' => 'Plastik',
                        'weight' => 45.0,
                        'price_per_kg' => 4500,
                        'subtotal' => 202500,
                    ],
                    [
                        'waste_id' => 'WST-003',
                        'waste_name' => 'Gelas Plastik PP Bening',
                        'category_id' => 'CAT-001',
                        'category_name' => 'Plastik',
                        'weight' => 22.0,
                        'price_per_kg' => 3200,
                        'subtotal' => 70400,
                    ],
                    [
                        'waste_id' => 'WST-004',
                        'waste_name' => 'Kardus Bekas Gelombang',
                        'category_id' => 'CAT-002',
                        'category_name' => 'Kertas & Karton',
                        'weight' => 65.0,
                        'price_per_kg' => 2200,
                        'subtotal' => 143000,
                    ],
                ],
                'total_weight' => 132.0,
                'total_amount' => 415900,
                'status' => 'completed',
                'notes' => 'Penyetoran berkala Bank Sampah RW.',
                'created_at' => '2026-03-05T15:40:00Z',
                'updated_at' => '2026-03-05T15:40:00Z',
            ],
        ];
    }
}

