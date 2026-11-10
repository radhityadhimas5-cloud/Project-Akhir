<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $categories = $this->categoryService->getAllCategories($search);

        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori berhasil diambil.',
            'data' => $categories,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail kategori berhasil diambil.',
            'data' => $category,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = $request->input('name');
        if (empty($name)) {
            return response()->json([
                'success' => false,
                'message' => 'Nama kategori wajib diisi.',
                'errors' => ['name' => ['Nama kategori tidak boleh kosong.']],
            ], 422);
        }

        $category = $this->categoryService->createCategory($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Kategori baru berhasil ditambahkan.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $name = $request->input('name');
        if ($request->has('name') && empty($name)) {
            return response()->json([
                'success' => false,
                'message' => 'Nama kategori tidak boleh kosong.',
                'errors' => ['name' => ['Nama kategori tidak boleh kosong.']],
            ], 422);
        }

        $category = $this->categoryService->updateCategory($id, $request->all());

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diperbarui.',
            'data' => $category,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $result = $this->categoryService->deleteCategory($id);

        return response()->json($result, $result['status'] ?? 200);
    }
}

