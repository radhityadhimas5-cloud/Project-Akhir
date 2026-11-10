<?php

namespace App\Services;

use App\Repositories\SettingRepository;

class SettingService
{
    protected SettingRepository $settingRepo;

    public function __construct(SettingRepository $settingRepo)
    {
        $this->settingRepo = $settingRepo;
    }

    public function getSettings(): array
    {
        return $this->settingRepo->getSettings();
    }

    public function updateSettings(array $data): array
    {
        return $this->settingRepo->updateSettings($data);
    }
}

