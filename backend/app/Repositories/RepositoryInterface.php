<?php

namespace App\Repositories;

interface RepositoryInterface
{
    public function all(): array;
    public function find(string $id): ?array;
    public function create(array $data): array;
    public function update(string $id, array $data): ?array;
    public function delete(string $id): bool;
}

