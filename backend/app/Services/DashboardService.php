<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\CustomerRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\WasteRepository;

class DashboardService
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

    public function getDashboardData(?string $period = 'monthly'): array
    {
        $transactions = $this->transactionRepo->all();
        $categories = $this->categoryRepo->all();
        $customers = $this->customerRepo->all();
        $wasteItems = $this->wasteRepo->all();

        // 1. Calculate Summary Metrics
        $totalWeight = 0;
        $totalAmount = 0;
        $wasteToday = 0;
        $todayDateStr = date('Y-m-d');

        foreach ($transactions as $trx) {
            $w = (float) ($trx['total_weight'] ?? 0);
            $a = (float) ($trx['total_amount'] ?? 0);
            $totalWeight += $w;
            $totalAmount += $a;

            $trxDateStr = substr($trx['date'] ?? $trx['created_at'], 0, 10);
            if ($trxDateStr === $todayDateStr) {
                $wasteToday += $w;
            }
        }

        // 2. Waste Category Distribution
        $catDistribution = [];
        $catMap = [];
        foreach ($categories as $c) {
            $catMap[$c['id']] = $c;
            $catDistribution[$c['id']] = [
                'id' => $c['id'],
                'name' => $c['name'],
                'color' => $c['color'] ?? '#10B981',
                'weight' => 0,
                'amount' => 0,
            ];
        }

        // Waste Type Statistics
        $wasteTypeStats = [];
        foreach ($wasteItems as $w) {
            $wasteTypeStats[$w['id']] = [
                'id' => $w['id'],
                'name' => $w['name'],
                'category_id' => $w['category_id'] ?? '',
                'weight' => 0,
                'amount' => 0,
            ];
        }

        // Aggregate from transaction items
        foreach ($transactions as $trx) {
            if (isset($trx['items']) && is_array($trx['items'])) {
                foreach ($trx['items'] as $item) {
                    $catId = $item['category_id'] ?? '';
                    $wasteId = $item['waste_id'] ?? '';
                    $itemWeight = (float) ($item['weight'] ?? 0);
                    $itemSubtotal = (float) ($item['subtotal'] ?? 0);

                    if (isset($catDistribution[$catId])) {
                        $catDistribution[$catId]['weight'] += $itemWeight;
                        $catDistribution[$catId]['amount'] += $itemSubtotal;
                    }

                    if (isset($wasteTypeStats[$wasteId])) {
                        $wasteTypeStats[$wasteId]['weight'] += $itemWeight;
                        $wasteTypeStats[$wasteId]['amount'] += $itemSubtotal;
                    }
                }
            }
        }

        // 3. Trends over time
        // Generate trend points (last 7 days or 6 months based on period)
        $trendLabels = [];
        $trendWeights = [];
        $trendAmounts = [];

        if ($period === 'daily' || $period === 'weekly') {
            for ($i = 6; $i >= 0; $i--) {
                $d = date('Y-m-d', strtotime("-$i days"));
                $label = date('d M', strtotime($d));
                $trendLabels[] = $label;

                $dayWeight = 0;
                $dayAmount = 0;
                foreach ($transactions as $trx) {
                    $trxDate = substr($trx['date'] ?? $trx['created_at'], 0, 10);
                    if ($trxDate === $d) {
                        $dayWeight += (float) ($trx['total_weight'] ?? 0);
                        $dayAmount += (float) ($trx['total_amount'] ?? 0);
                    }
                }
                $trendWeights[] = round($dayWeight, 1);
                $trendAmounts[] = round($dayAmount, 0);
            }
        } else {
            // Monthly trends for past 6 months
            for ($i = 5; $i >= 0; $i--) {
                $m = date('Y-m', strtotime("-$i months"));
                $label = date('M Y', strtotime($m . '-01'));
                $trendLabels[] = $label;

                $mWeight = 0;
                $mAmount = 0;
                foreach ($transactions as $trx) {
                    $trxMonth = substr($trx['date'] ?? $trx['created_at'], 0, 7);
                    if ($trxMonth === $m) {
                        $mWeight += (float) ($trx['total_weight'] ?? 0);
                        $mAmount += (float) ($trx['total_amount'] ?? 0);
                    }
                }
                $trendWeights[] = round($mWeight, 1);
                $trendAmounts[] = round($mAmount, 0);
            }
        }

        // 4. Recent Transactions (Top 5)
        $sortedTrx = $transactions;
        usort($sortedTrx, function ($a, $b) {
            return strtotime($b['date'] ?? $b['created_at']) <=> strtotime($a['date'] ?? $a['created_at']);
        });
        $recentTransactions = array_slice($sortedTrx, 0, 5);

        // 5. Top Customers by Total Value / Weight
        $customerAggregates = [];
        foreach ($customers as $cust) {
            $customerAggregates[$cust['id']] = [
                'id' => $cust['id'],
                'name' => $cust['name'],
                'type' => $cust['type'] ?? 'Individual',
                'phone' => $cust['phone'] ?? '',
                'total_weight' => 0,
                'total_amount' => 0,
                'trx_count' => 0,
            ];
        }
        foreach ($transactions as $trx) {
            $cId = $trx['customer_id'] ?? '';
            if (isset($customerAggregates[$cId])) {
                $customerAggregates[$cId]['total_weight'] += (float) ($trx['total_weight'] ?? 0);
                $customerAggregates[$cId]['total_amount'] += (float) ($trx['total_amount'] ?? 0);
                $customerAggregates[$cId]['trx_count']++;
            }
        }
        usort($customerAggregates, function ($a, $b) {
            return $b['total_amount'] <=> $a['total_amount'];
        });
        $topCustomers = array_slice(array_values($customerAggregates), 0, 5);

        // 6. Recent Activities Stream
        $activities = [];
        foreach (array_slice($sortedTrx, 0, 4) as $trx) {
            $activities[] = [
                'id' => 'act-' . $trx['id'],
                'type' => 'transaction',
                'title' => 'Penyetoran Sampah Baru',
                'description' => sprintf('%s menyetor %.1f kg sampah senilai Rp %s', $trx['customer_name'], $trx['total_weight'], number_format($trx['total_amount'], 0, ',', '.')),
                'timestamp' => $trx['date'] ?? $trx['created_at'],
                'icon' => 'truck',
                'color' => 'emerald',
            ];
        }
        // Add customer registration activities
        foreach (array_slice($customers, -2) as $c) {
            $activities[] = [
                'id' => 'act-cust-' . $c['id'],
                'type' => 'customer',
                'title' => 'Nasabah Baru Terdaftar',
                'description' => sprintf('%s bergabung sebagai nasabah kategori %s', $c['name'], $c['type']),
                'timestamp' => $c['created_at'],
                'icon' => 'user-plus',
                'color' => 'blue',
            ];
        }
        usort($activities, function ($a, $b) {
            return strtotime($b['timestamp']) <=> strtotime($a['timestamp']);
        });

        // Sort waste type stats
        $topWasteTypes = array_values($wasteTypeStats);
        usort($topWasteTypes, function ($a, $b) {
            return $b['weight'] <=> $a['weight'];
        });

        return [
            'metrics' => [
                'total_waste_kg' => round($totalWeight, 1),
                'total_categories' => count($categories),
                'total_customers' => count($customers),
                'total_transactions' => count($transactions),
                'total_transaction_value' => round($totalAmount, 0),
                'waste_collected_today_kg' => round($wasteToday, 1),
            ],
            'charts' => [
                'trends' => [
                    'labels' => $trendLabels,
                    'weights' => $trendWeights,
                    'amounts' => $trendAmounts,
                ],
                'categories' => array_values($catDistribution),
                'waste_types' => array_slice($topWasteTypes, 0, 6),
            ],
            'recent_transactions' => $recentTransactions,
            'top_customers' => $topCustomers,
            'activities' => array_slice($activities, 0, 6),
        ];
    }
}

