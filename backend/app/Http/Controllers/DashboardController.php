<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', 'monthly');
        $data = $this->dashboardService->getDashboardData($period);

        return response()->json([
            'success' => true,
            'message' => 'Statistik dashboard berhasil dimuat.',
            'data' => $data,
        ]);
    }
}

