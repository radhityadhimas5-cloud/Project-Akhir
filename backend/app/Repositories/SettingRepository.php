<?php

namespace App\Repositories;

class SettingRepository extends BaseTemporaryRepository
{
    protected string $collectionKey = 'settings';
    protected string $idPrefix = 'SET';

    public function getSettings(): array
    {
        $all = $this->all();
        return $all[0] ?? $this->getInitialData()[0];
    }

    public function updateSettings(array $data): array
    {
        $current = $this->getSettings();
        $merged = array_merge($current, $data);
        $merged['updated_at'] = now()->toIso8601String();

        $store = $this->loadStore();
        $store[$this->collectionKey] = [$merged];
        static::$dataStore = $store;
        $this->saveStore();

        return $merged;
    }

    public function getInitialData(): array
    {
        return [
            [
                'id' => 'SET-001',
                'app_name' => 'Waste Management System',
                'tagline' => 'Digital Recycling Network & Waste Bank Administration',
                'org_name' => 'MallSampah Recycling Network',
                'email' => 'contact@mallsampah.com',
                'phone' => '+62 811-4455-667',
                'address' => 'Jl. Pelita Harapan Indah No. 108, Kebayoran Baru, Jakarta Selatan 12160',
                'currency' => 'IDR (Rp)',
                'currency_symbol' => 'Rp',
                'receipt_header' => 'BUKTI PENERIMAAN BANK SAMPAH',
                'receipt_footer' => 'Terima kasih telah berkontribusi aktif memilah sampah dan merawat kelestarian lingkungan!',
                'maintenance_mode' => false,
                'created_at' => '2026-01-01T00:00:00Z',
                'updated_at' => '2026-01-01T00:00:00Z',
            ],
        ];
    }
}

