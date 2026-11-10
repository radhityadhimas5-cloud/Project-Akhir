<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\WasteRepository;

class ReportService
{
    protected TransactionRepository $transactionRepo;
    protected WasteRepository $wasteRepo;
    protected CategoryRepository $categoryRepo;
    protected CustomerRepository $customerRepo;

    public function __construct(
        TransactionRepository $transactionRepo,
        WasteRepository $wasteRepo,
        CategoryRepository $categoryRepo,
        CustomerRepository $customerRepo
    ) {
        $this->transactionRepo = $transactionRepo;
        $this->wasteRepo = $wasteRepo;
        $this->categoryRepo = $categoryRepo;
        $this->customerRepo = $customerRepo;
    }

    public function generateReport(array $filters): array
    {
        $reportType = $filters['type'] ?? 'collection'; // 'collection', 'transactions', 'categories', 'waste_types', 'customers'
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;
        $categoryId = $filters['category_id'] ?? null;
        $wasteId = $filters['waste_id'] ?? null;
        $search = $filters['search'] ?? null;

        $transactions = $this->transactionRepo->all();
        $categories = $this->categoryRepo->all();
        $wasteItems = $this->wasteRepo->all();
        $customers = $this->customerRepo->all();

        // 1. Date range filter
        if ($startDate) {
            $startTs = strtotime($startDate . ' 00:00:00');
            $transactions = array_values(array_filter($transactions, function ($trx) use ($startTs) {
                return strtotime($trx['date'] ?? $trx['created_at']) >= $startTs;
            }));
        }
        if ($endDate) {
            $endTs = strtotime($endDate . ' 23:59:59');
            $transactions = array_values(array_filter($transactions, function ($trx) use ($endTs) {
                return strtotime($trx['date'] ?? $trx['created_at']) <= $endTs;
            }));
        }

        // Summary calculations
        $totalWeight = 0;
        $totalAmount = 0;
        $allLineItems = [];

        foreach ($transactions as $trx) {
            if (isset($trx['items']) && is_array($trx['items'])) {
                foreach ($trx['items'] as $item) {
                    // Category filter
                    if ($categoryId && $categoryId !== 'all' && ($item['category_id'] ?? '') !== $categoryId) {
                        continue;
                    }
                    // Waste filter
                    if ($wasteId && $wasteId !== 'all' && ($item['waste_id'] ?? '') !== $wasteId) {
                        continue;
                    }

                    $lineItem = [
                        'transaction_id' => $trx['id'],
                        'date' => $trx['date'] ?? $trx['created_at'],
                        'customer_id' => $trx['customer_id'],
                        'customer_name' => $trx['customer_name'],
                        'staff_name' => $trx['staff_name'] ?? 'Petugas',
                        'waste_id' => $item['waste_id'],
                        'waste_name' => $item['waste_name'],
                        'category_id' => $item['category_id'] ?? '',
                        'category_name' => $item['category_name'] ?? 'Umum',
                        'weight' => (float) ($item['weight'] ?? 0),
                        'price_per_kg' => (float) ($item['price_per_kg'] ?? 0),
                        'subtotal' => (float) ($item['subtotal'] ?? 0),
                    ];

                    $totalWeight += $lineItem['weight'];
                    $totalAmount += $lineItem['subtotal'];
                    $allLineItems[] = $lineItem;
                }
            }
        }

        // Search filter on line items or transactions
        if ($search) {
            $s = strtolower(trim($search));
            $allLineItems = array_values(array_filter($allLineItems, function ($item) use ($s) {
                return str_contains(strtolower($item['transaction_id']), $s) ||
                       str_contains(strtolower($item['customer_name']), $s) ||
                       str_contains(strtolower($item['waste_name']), $s) ||
                       str_contains(strtolower($item['category_name']), $s);
            }));
        }

        // Aggregate by Category
        $byCategory = [];
        foreach ($allLineItems as $item) {
            $cName = $item['category_name'];
            if (!isset($byCategory[$cName])) {
                $byCategory[$cName] = [
                    'category' => $cName,
                    'total_weight' => 0,
                    'total_amount' => 0,
                    'item_count' => 0,
                ];
            }
            $byCategory[$cName]['total_weight'] += $item['weight'];
            $byCategory[$cName]['total_amount'] += $item['subtotal'];
            $byCategory[$cName]['item_count']++;
        }

        // Aggregate by Waste Type
        $byWaste = [];
        foreach ($allLineItems as $item) {
            $wName = $item['waste_name'];
            if (!isset($byWaste[$wName])) {
                $byWaste[$wName] = [
                    'waste_name' => $wName,
                    'category_name' => $item['category_name'],
                    'total_weight' => 0,
                    'total_amount' => 0,
                    'count' => 0,
                ];
            }
            $byWaste[$wName]['total_weight'] += $item['weight'];
            $byWaste[$wName]['total_amount'] += $item['subtotal'];
            $byWaste[$wName]['count']++;
        }

        // Aggregate by Customer
        $byCustomer = [];
        foreach ($allLineItems as $item) {
            $cName = $item['customer_name'];
            if (!isset($byCustomer[$cName])) {
                $byCustomer[$cName] = [
                    'customer_name' => $cName,
                    'total_weight' => 0,
                    'total_amount' => 0,
                    'transaction_ids' => [],
                ];
            }
            $byCustomer[$cName]['total_weight'] += $item['weight'];
            $byCustomer[$cName]['total_amount'] += $item['subtotal'];
            $byCustomer[$cName]['transaction_ids'][$item['transaction_id']] = true;
        }
        foreach ($byCustomer as &$cItem) {
            $cItem['transaction_count'] = count($cItem['transaction_ids']);
            unset($cItem['transaction_ids']);
        }

        return [
            'summary' => [
                'total_weight_kg' => round($totalWeight, 2),
                'total_amount_idr' => round($totalAmount, 0),
                'total_transactions' => count($transactions),
                'total_records' => count($allLineItems),
                'generated_at' => now()->toIso8601String(),
            ],
            'filters_applied' => [
                'report_type' => $reportType,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'category_id' => $categoryId,
                'waste_id' => $wasteId,
            ],
            'line_items' => $allLineItems,
            'by_category' => array_values($byCategory),
            'by_waste' => array_values($byWaste),
            'by_customer' => array_values($byCustomer),
            'transactions' => $transactions,
        ];
    }
}

