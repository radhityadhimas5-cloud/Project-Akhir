<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\WasteRepository;

class WasteService
{
    protected WasteRepository $wasteRepo;
    protected CategoryRepository $categoryRepo;

    public function __construct(WasteRepository $wasteRepo, CategoryRepository $categoryRepo)
    {
        $this->wasteRepo = $wasteRepo;
        $this->categoryRepo = $categoryRepo;
    }

    public function getAllWaste(?string $search = null, ?string $categoryId = null, ?string $sortBy = 'name', ?string $sortOrder = 'asc'): array
    {
        $wasteItems = $this->wasteRepo->all();
        $categories = $this->categoryRepo->all();
        $categoryMap = [];
        foreach ($categories as $cat) {
            $categoryMap[$cat['id']] = $cat;
        }

        // Attach category info
        foreach ($wasteItems as &$item) {
            $catId = $item['category_id'] ?? '';
            $cat = $categoryMap[$catId] ?? null;
            $item['category_name'] = $cat ? $cat['name'] : 'Tanpa Kategori';
            $item['category_color'] = $cat ? ($cat['color'] ?? '#10B981') : '#94A3B8';
        }

        // Category filter
        if ($categoryId && $categoryId !== 'all') {
            $wasteItems = array_values(array_filter($wasteItems, function ($item) use ($categoryId) {
                return ($item['category_id'] ?? '') === $categoryId;
            }));
        }

        // Search filter
        if ($search) {
            $search = strtolower(trim($search));
            $wasteItems = array_values(array_filter($wasteItems, function ($item) use ($search) {
                return str_contains(strtolower($item['name']), $search) ||
                       str_contains(strtolower($item['description'] ?? ''), $search) ||
                       str_contains(strtolower($item['category_name'] ?? ''), $search);
            }));
        }

        // Sorting
        usort($wasteItems, function ($a, $b) use ($sortBy, $sortOrder) {
            $valA = $a[$sortBy] ?? '';
            $valB = $b[$sortBy] ?? '';

            if (is_numeric($valA) && is_numeric($valB)) {
                $res = $valA <=> $valB;
            } else {
                $res = strcasecmp((string)$valA, (string)$valB);
            }

            return strtolower($sortOrder) === 'desc' ? -$res : $res;
        });

        return $wasteItems;
    }

    public function getWasteById(string $id): ?array
    {
        $waste = $this->wasteRepo->find($id);
        if (!$waste) {
            return null;
        }

        $category = $this->categoryRepo->find($waste['category_id'] ?? '');
        $waste['category_name'] = $category ? $category['name'] : 'Tanpa Kategori';
        $waste['category_color'] = $category ? ($category['color'] ?? '#10B981') : '#94A3B8';

        return $waste;
    }

    public function createWaste(array $data): array
    {
        return $this->wasteRepo->create([
            'name' => trim($data['name']),
            'category_id' => $data['category_id'],
            'description' => trim($data['description'] ?? ''),
            'price_per_kg' => (float) $data['price_per_kg'],
            'unit' => $data['unit'] ?? 'kg',
        ]);
    }

    public function updateWaste(string $id, array $data): ?array
    {
        $existing = $this->wasteRepo->find($id);
        if (!$existing) {
            return null;
        }

        return $this->wasteRepo->update($id, [
            'name' => trim($data['name'] ?? $existing['name']),
            'category_id' => $data['category_id'] ?? $existing['category_id'],
            'description' => trim($data['description'] ?? ($existing['description'] ?? '')),
            'price_per_kg' => isset($data['price_per_kg']) ? (float)$data['price_per_kg'] : $existing['price_per_kg'],
            'unit' => $data['unit'] ?? ($existing['unit'] ?? 'kg'),
        ]);
    }

    public function deleteWaste(string $id): bool
    {
        return $this->wasteRepo->delete($id);
    }
}

