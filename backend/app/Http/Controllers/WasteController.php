<?php

namespace App\Http\Controllers;

use App\Services\WasteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WasteController extends Controller
{
    protected WasteService $wasteService;

    public function __construct(WasteService $wasteService)
    {
        $this->wasteService = $wasteService;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $sortBy = $request->query('sort_by', 'name');
        $sortOrder = $request->query('sort_order', 'asc');

        $wasteList = $this->wasteService->getAllWaste($search, $categoryId, $sortBy, $sortOrder);

        return response()->json([
            'success' => true,
            'message' => 'Daftar jenis sampah berhasil dimuat.',
            'data' => $wasteList,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $waste = $this->wasteService->getWasteById($id);

        if (!$waste) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis sampah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail jenis sampah berhasil diambil.',
            'data' => $waste,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = $request->input('name');
        $categoryId = $request->input('category_id');
        $price = $request->input('price_per_kg');

        $errors = [];
        if (empty($name)) {
            $errors['name'] = ['Nama jenis sampah wajib diisi.'];
        }
        if (empty($categoryId)) {
            $errors['category_id'] = ['Kategori sampah wajib dipilih.'];
        }
        if ($price === null || $price === '' || (float)$price < 0) {
            $errors['price_per_kg'] = ['Harga per kg harus berupa angka positif.'];
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi data gagal.',
                'errors' => $errors,
            ], 422);
        }

        $waste = $this->wasteService->createWaste($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Jenis sampah baru berhasil ditambahkan.',
            'data' => $waste,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $price = $request->input('price_per_kg');
        if ($price !== null && (float)$price < 0) {
            return response()->json([
                'success' => false,
                'message' => 'Harga per kg harus berupa angka positif.',
                'errors' => ['price_per_kg' => ['Harga tidak boleh negatif.']],
            ], 422);
        }

        $waste = $this->wasteService->updateWaste($id, $request->all());

        if (!$waste) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis sampah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data jenis sampah berhasil diperbarui.',
            'data' => $waste,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->wasteService->deleteWaste($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis sampah tidak ditemukan atau gagal dihapus.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Jenis sampah berhasil dihapus.',
        ]);
    }
}

