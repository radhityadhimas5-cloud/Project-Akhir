<?php

namespace App\Repositories;

class CustomerRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'customers';
    protected string $idPrefix = 'CUST';

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'CUST-001',
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@gmail.com',
                'phone' => '0812-3456-7890',
                'address' => 'Jl. Sudirman No. 45, RT 02/RW 05, Jakarta Selatan',
                'type' => 'Individual',
                'status' => 'active',
                'registration_date' => '2026-01-15',
                'created_at' => '2026-01-15T09:00:00Z',
                'updated_at' => '2026-01-15T09:00:00Z',
            ],
            [
                'id' => 'CUST-002',
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@yahoo.com',
                'phone' => '0819-8765-4321',
                'address' => 'Jl. Merdeka Barat No. 12, Bandung',
                'type' => 'Individual',
                'status' => 'active',
                'registration_date' => '2026-01-20',
                'created_at' => '2026-01-20T10:15:00Z',
                'updated_at' => '2026-01-20T10:15:00Z',
            ],
            [
                'id' => 'CUST-003',
                'name' => 'PT Berkah Hijau Mandiri',
                'email' => 'procurement@berkahhijau.co.id',
                'phone' => '0811-9988-7766',
                'address' => 'Kawasan Industri MM2100 Blok C-4, Cikarang, Bekasi',
                'type' => 'Corporate / Business',
                'status' => 'active',
                'registration_date' => '2026-02-01',
                'created_at' => '2026-02-01T11:00:00Z',
                'updated_at' => '2026-02-01T11:00:00Z',
            ],
            [
                'id' => 'CUST-004',
                'name' => 'Restoran Rasa Nusantara',
                'email' => 'kitchen@rasanusantara.com',
                'phone' => '0813-4455-6677',
                'address' => 'Jl. M.H. Thamrin Kav. 28-30, Jakarta Pusat',
                'type' => 'Business',
                'status' => 'active',
                'registration_date' => '2026-02-14',
                'created_at' => '2026-02-14T13:45:00Z',
                'updated_at' => '2026-02-14T13:45:00Z',
            ],
            [
                'id' => 'CUST-005',
                'name' => 'Hendra Kusuma (Bank Sampah Unit RW 08)',
                'email' => 'hendra.kusuma@gmail.com',
                'phone' => '0821-5544-3322',
                'address' => 'Komplek Griya Asri Blok D No. 8, Tangerang',
                'type' => 'Community Group',
                'status' => 'active',
                'registration_date' => '2026-02-25',
                'created_at' => '2026-02-25T14:20:00Z',
                'updated_at' => '2026-02-25T14:20:00Z',
            ],
            [
                'id' => 'CUST-006',
                'name' => 'Warung Kopi Senja Abadi',
                'email' => 'kopisenja@gmail.com',
                'phone' => '0877-2233-4455',
                'address' => 'Jl. Tebet Raya No. 19, Tebet, Jakarta Selatan',
                'type' => 'Business',
                'status' => 'active',
                'registration_date' => '2026-03-01',
                'created_at' => '2026-03-01T08:30:00Z',
                'updated_at' => '2026-03-01T08:30:00Z',
            ],
        ];
    }
}

