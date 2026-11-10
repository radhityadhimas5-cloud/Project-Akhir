<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'type' => $request->query('type', 'collection'),
            'start_date' => $request->query('start_date'),
            'end_date' => $request->query('end_date'),
            'category_id' => $request->query('category_id'),
            'waste_id' => $request->query('waste_id'),
            'search' => $request->query('search'),
        ];

        $report = $this->reportService->generateReport($filters);

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dibuat.',
            'data' => $report,
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        $filters = [
            'type' => 'collection',
            'start_date' => $request->query('start_date'),
            'end_date' => $request->query('end_date'),
        ];

        $report = $this->reportService->generateReport($filters);

        return response()->json([
            'success' => true,
            'message' => 'Ringkasan laporan berhasil dimuat.',
            'data' => $report['summary'],
        ]);
    }
}

