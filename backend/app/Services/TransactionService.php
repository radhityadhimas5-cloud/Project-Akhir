<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\WasteRepository;

class TransactionService
{
    protected TransactionRepository $transactionRepo;
    protected CustomerRepository $customerRepo;
    protected WasteRepository $wasteRepo;
    protected CategoryRepository $categoryRepo;

    public function __construct(
        TransactionRepository $transactionRepo,
        CustomerRepository $customerRepo,
        WasteRepository $wasteRepo,
        CategoryRepository $categoryRepo
    ) {
        $this->transactionRepo = $transactionRepo;
        $this->customerRepo = $customerRepo;
        $this->wasteRepo = $wasteRepo;
        $this->categoryRepo = $categoryRepo;
    }

    public function getAllTransactions(?string $search = null, ?string $customerId = null, ?string $startDate = null, ?string $endDate = null): array
    {
        $transactions = $this->transactionRepo->all();

        // Customer filter
        if ($customerId && $customerId !== 'all') {
            $transactions = array_values(array_filter($transactions, function ($trx) use ($customerId) {
                return ($trx['customer_id'] ?? '') === $customerId;
            }));
        }

        // Date range filter
        if ($startDate) {
            $startTs = strtotime($startDate . ' 00:00:00');
            $transactions = array_values(array_filter($transactions, function ($trx) use ($startTs) {
                $trxTs = strtotime($trx['date'] ?? $trx['created_at']);
                return $trxTs >= $startTs;
            }));
        }
        if ($endDate) {
            $endTs = strtotime($endDate . ' 23:59:59');
            $transactions = array_values(array_filter($transactions, function ($trx) use ($endTs) {
                $trxTs = strtotime($trx['date'] ?? $trx['created_at']);
                return $trxTs <= $endTs;
            }));
        }

        // Search filter
        if ($search) {
            $search = strtolower(trim($search));
            $transactions = array_values(array_filter($transactions, function ($trx) use ($search) {
                return str_contains(strtolower($trx['id']), $search) ||
                       str_contains(strtolower($trx['customer_name'] ?? ''), $search) ||
                       str_contains(strtolower($trx['staff_name'] ?? ''), $search) ||
                       str_contains(strtolower($trx['notes'] ?? ''), $search);
            }));
        }

        // Sort descending by date
        usort($transactions, function ($a, $b) {
            return strtotime($b['date'] ?? $b['created_at']) <=> strtotime($a['date'] ?? $a['created_at']);
        });

        return $transactions;
    }

    public function getTransactionById(string $id): ?array
    {
        $trx = $this->transactionRepo->find($id);
        if (!$trx) {
            return null;
        }

        // Enrich with customer details
        $customer = $this->customerRepo->find($trx['customer_id'] ?? '');
        $trx['customer'] = $customer;

        return $trx;
    }

    public function createTransaction(array $data, ?array $user = null): array
    {
        // 1. Validate Customer
        $customerId = $data['customer_id'] ?? null;
        if (!$customerId) {
            return [
                'success' => false,
                'message' => 'Nasabah/Customer wajib dipilih.',
                'status' => 422,
            ];
        }

        $customer = $this->customerRepo->find($customerId);
        if (!$customer) {
            return [
                'success' => false,
                'message' => 'Nasabah tidak valid atau tidak ditemukan.',
                'status' => 422,
            ];
        }

        // 2. Validate Items
        $rawItems = $data['items'] ?? [];
        if (!is_array($rawItems) || count($rawItems) === 0) {
            return [
                'success' => false,
                'message' => 'Transaksi harus memiliki minimal satu jenis sampah.',
                'status' => 422,
            ];
        }

        $processedItems = [];
        $totalWeight = 0;
        $totalAmount = 0;

        $categories = $this->categoryRepo->all();
        $catMap = [];
        foreach ($categories as $c) {
            $catMap[$c['id']] = $c;
        }

        foreach ($rawItems as $index => $item) {
            $wasteId = $item['waste_id'] ?? null;
            $weight = (float) ($item['weight'] ?? 0);

            if (!$wasteId) {
                return [
                    'success' => false,
                    'message' => "Jenis sampah pada baris ke-" . ($index + 1) . " wajib dipilih.",
                    'status' => 422,
                ];
            }

            if ($weight <= 0) {
                return [
                    'success' => false,
                    'message' => "Berat sampah pada baris ke-" . ($index + 1) . " harus lebih besar dari 0 kg.",
                    'status' => 422,
                ];
            }

            $waste = $this->wasteRepo->find($wasteId);
            if (!$waste) {
                return [
                    'success' => false,
                    'message' => "Data jenis sampah ID '$wasteId' tidak ditemukan di sistem.",
                    'status' => 422,
                ];
            }

            // Always take the official price snapshot from the waste data
            $pricePerKg = (float) $waste['price_per_kg'];
            $subtotal = round($weight * $pricePerKg, 2);

            $catId = $waste['category_id'] ?? '';
            $catName = isset($catMap[$catId]) ? $catMap[$catId]['name'] : 'Umum';

            $processedItems[] = [
                'waste_id' => $waste['id'],
                'waste_name' => $waste['name'],
                'category_id' => $catId,
                'category_name' => $catName,
                'weight' => $weight,
                'price_per_kg' => $pricePerKg,
                'subtotal' => $subtotal,
            ];

            $totalWeight += $weight;
            $totalAmount += $subtotal;
        }

        $staffId = $user['id'] ?? ($data['staff_id'] ?? 'USR-001');
        $staffName = $user['name'] ?? ($data['staff_name'] ?? 'Radhitya Dhimas Ardyansyah');

        $transactionRecord = [
            'customer_id' => $customer['id'],
            'customer_name' => $customer['name'],
            'staff_id' => $staffId,
            'staff_name' => $staffName,
            'date' => $data['date'] ?? now()->toIso8601String(),
            'items' => $processedItems,
            'total_weight' => round($totalWeight, 2),
            'total_amount' => round($totalAmount, 2),
            'status' => $data['status'] ?? 'completed',
            'notes' => trim($data['notes'] ?? ''),
        ];

        $created = $this->transactionRepo->create($transactionRecord);

        return [
            'success' => true,
            'message' => 'Transaksi penyetoran sampah berhasil dicatat!',
            'data' => $created,
            'status' => 201,
        ];
    }

    public function deleteTransaction(string $id): bool
    {
        return $this->transactionRepo->delete($id);
    }
}

