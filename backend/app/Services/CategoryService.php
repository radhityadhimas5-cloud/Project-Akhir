<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\WasteRepository;

class CategoryService
{
    protected CategoryRepository $categoryRepo;
    protected WasteRepository $wasteRepo;

    public function __construct(CategoryRepository $categoryRepo, WasteRepository $wasteRepo)
    {
        $this->categoryRepo = $categoryRepo;
        $this->wasteRepo = $wasteRepo;
    }

    public function getAllCategories(?string $search = null): array
    {
        $categories = $this->categoryRepo->all();
        $allWaste = $this->wasteRepo->all();

        // Calculate count of associated waste types
        foreach ($categories as &$category) {
            $count = 0;
            foreach ($allWaste as $waste) {
                if (isset($waste['category_id']) && $waste['category_id'] === $category['id']) {
                    $count++;
                }
            }
            $category['waste_count'] = $count;
        }

        if ($search) {
            $search = strtolower(trim($search));
            $categories = array_values(array_filter($categories, function ($cat) use ($search) {
                return str_contains(strtolower($cat['name']), $search) ||
                       str_contains(strtolower($cat['description'] ?? ''), $search);
            }));
        }

        return $categories;
    }

    public function getCategoryById(string $id): ?array
    {
        $category = $this->categoryRepo->find($id);
        if (!$category) {
            return null;
        }

        $allWaste = $this->wasteRepo->all();
        $linkedWaste = [];
        foreach ($allWaste as $waste) {
            if (isset($waste['category_id']) && $waste['category_id'] === $id) {
                $linkedWaste[] = $waste;
            }
        }
        $category['waste_count'] = count($linkedWaste);
        $category['waste_items'] = $linkedWaste;

        return $category;
    }

    public function createCategory(array $data): array
    {
        return $this->categoryRepo->create([
            'name' => trim($data['name']),
            'description' => trim($data['description'] ?? ''),
            'color' => $data['color'] ?? '#10B981',
            'icon' => $data['icon'] ?? 'recycle',
        ]);
    }

    public function updateCategory(string $id, array $data): ?array
    {
        $existing = $this->categoryRepo->find($id);
        if (!$existing) {
            return null;
        }

        return $this->categoryRepo->update($id, [
            'name' => trim($data['name'] ?? $existing['name']),
            'description' => trim($data['description'] ?? $existing['description']),
            'color' => $data['color'] ?? ($existing['color'] ?? '#10B981'),
            'icon' => $data['icon'] ?? ($existing['icon'] ?? 'recycle'),
        ]);
    }

    public function deleteCategory(string $id): array
    {
        $category = $this->categoryRepo->find($id);
        if (!$category) {
            return [
                'success' => false,
                'message' => 'Kategori tidak ditemukan.',
                'status' => 404,
            ];
        }

        // Prevent deletion if associated waste types exist
        $linkedWaste = $this->wasteRepo->findByCategoryId($id);
        if (count($linkedWaste) > 0) {
            return [
                'success' => false,
                'message' => sprintf(
                    'Tidak dapat menghapus kategori "%s" karena masih memiliki %d jenis sampah terkait. Hapus atau pindahkan jenis sampah tersebut terlebih dahulu.',
                    $category['name'],
                    count($linkedWaste)
                ),
                'status' => 422,
            ];
        }

        $deleted = $this->categoryRepo->delete($id);
        return [
            'success' => $deleted,
            'message' => $deleted ? 'Kategori berhasil dihapus.' : 'Gagal menghapus kategori.',
            'status' => $deleted ? 200 : 500,
        ];
    }
}

