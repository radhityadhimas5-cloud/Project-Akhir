<?php

namespace App\Repositories;

use Illuminate\Support\Facades\File;

abstract class BaseTemporaryRepository implements RepositoryInterface
{
    protected string $collectionKey;
    protected string $idPrefix;
    protected static ?array $dataStore = null;

    abstract protected function getInitialData(): array;

    protected function getStoragePath(): string
    {
        return storage_path('app/temporary_store.json');
    }

    protected function loadStore(): array
    {
        if (static::$dataStore !== null) {
            return static::$dataStore;
        }

        $path = $this->getStoragePath();
        if (File::exists($path)) {
            $content = File::get($path);
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                static::$dataStore = $decoded;
                return static::$dataStore;
            }
        }

        // Initialize store with sample data
        static::$dataStore = $this->seedAllInitialData();
        $this->saveStore();
        return static::$dataStore;
    }

    protected function saveStore(): void
    {
        $path = $this->getStoragePath();
        $dir = dirname($path);
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }
        File::put($path, json_encode(static::$dataStore, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    protected function seedAllInitialData(): array
    {
        return [
            'users' => (new UserRepository())->getInitialData(),
            'categories' => (new CategoryRepository())->getInitialData(),
            'waste' => (new WasteRepository())->getInitialData(),
            'customers' => (new CustomerRepository())->getInitialData(),
            'transactions' => (new TransactionRepository())->getInitialData(),
            'settings' => (new SettingRepository())->getInitialData(),
        ];
    }

    public function all(): array
    {
        $store = $this->loadStore();
        return $store[$this->collectionKey] ?? [];
    }

    public function find(string $id): ?array
    {
        $items = $this->all();
        foreach ($items as $item) {
            if (isset($item['id']) && $item['id'] === $id) {
                return $item;
            }
        }
        return null;
    }

    public function create(array $data): array
    {
        $store = $this->loadStore();
        if (!isset($data['id']) || empty($data['id'])) {
            $data['id'] = $this->generateNextId();
        }
        if (!isset($data['created_at'])) {
            $data['created_at'] = now()->toIso8601String();
        }
        $data['updated_at'] = now()->toIso8601String();

        $store[$this->collectionKey][] = $data;
        static::$dataStore = $store;
        $this->saveStore();

        return $data;
    }

    public function update(string $id, array $data): ?array
    {
        $store = $this->loadStore();
        $items = $store[$this->collectionKey] ?? [];
        $found = false;
        $updatedItem = null;

        foreach ($items as $index => $item) {
            if (isset($item['id']) && $item['id'] === $id) {
                $merged = array_merge($item, $data);
                $merged['id'] = $id; // Guarantee ID is immutable
                $merged['updated_at'] = now()->toIso8601String();
                $items[$index] = $merged;
                $updatedItem = $merged;
                $found = true;
                break;
            }
        }

        if (!$found) {
            return null;
        }

        $store[$this->collectionKey] = array_values($items);
        static::$dataStore = $store;
        $this->saveStore();

        return $updatedItem;
    }

    public function delete(string $id): bool
    {
        $store = $this->loadStore();
        $items = $store[$this->collectionKey] ?? [];
        $originalCount = count($items);

        $filtered = array_filter($items, function ($item) use ($id) {
            return !isset($item['id']) || $item['id'] !== $id;
        });

        if (count($filtered) === $originalCount) {
            return false;
        }

        $store[$this->collectionKey] = array_values($filtered);
        static::$dataStore = $store;
        $this->saveStore();

        return true;
    }

    protected function generateNextId(): string
    {
        $items = $this->all();
        $maxNum = 0;
        foreach ($items as $item) {
            if (isset($item['id']) && str_starts_with($item['id'], $this->idPrefix . '-')) {
                $num = (int) substr($item['id'], strlen($this->idPrefix) + 1);
                if ($num > $maxNum) {
                    $maxNum = $num;
                }
            }
        }
        return sprintf('%s-%03d', $this->idPrefix, $maxNum + 1);
    }

    public function resetStore(): void
    {
        static::$dataStore = null;
        $path = $this->getStoragePath();
        if (File::exists($path)) {
            File::delete($path);
        }
        $this->loadStore();
    }
}

