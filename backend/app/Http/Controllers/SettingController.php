<?php

namespace App\Http\Controllers;

use App\Repositories\BaseTemporaryRepository;
use App\Repositories\CategoryRepository;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    protected SettingService $settingService;

    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function index(): JsonResponse
    {
        $settings = $this->settingService->getSettings();

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan sistem berhasil dimuat.',
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $updated = $this->settingService->updateSettings($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan sistem berhasil disimpan.',
            'data' => $updated,
        ]);
    }

    public function resetData(): JsonResponse
    {
        // Re-seed all mock data back to factory default
        $categoryRepo = new CategoryRepository();
        $categoryRepo->resetStore();

        return response()->json([
            'success' => true,
            'message' => 'Data sementara berhasil direset kembali ke data awal pabrik.',
        ]);
    }
}

