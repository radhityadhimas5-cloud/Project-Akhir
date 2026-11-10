<?php

namespace App\Services;

use App\Repositories\CustomerRepository;
use App\Repositories\TransactionRepository;

class CustomerService
{
    protected CustomerRepository $customerRepo;
    protected TransactionRepository $transactionRepo;

    public function __construct(CustomerRepository $customerRepo, TransactionRepository $transactionRepo)
    {
        $this->customerRepo = $customerRepo;
        $this->transactionRepo = $transactionRepo;
    }

    public function getAllCustomers(?string $search = null, ?string $type = null, ?string $sortBy = 'name', ?string $sortOrder = 'asc'): array
    {
        $customers = $this->customerRepo->all();
        $transactions = $this->transactionRepo->all();

        // Calculate aggregate statistics for each customer
        foreach ($customers as &$customer) {
            $custTrx = array_filter($transactions, function ($trx) use ($customer) {
                return ($trx['customer_id'] ?? '') === $customer['id'];
            });

            $totalWeight = 0;
            $totalAmount = 0;
            foreach ($custTrx as $trx) {
                $totalWeight += (float) ($trx['total_weight'] ?? 0);
                $totalAmount += (float) ($trx['total_amount'] ?? 0);
            }

            $customer['total_transactions'] = count($custTrx);
            $customer['total_weight_kg'] = round($totalWeight, 2);
            $customer['total_value_idr'] = $totalAmount;
        }

        // Type filter
        if ($type && $type !== 'all') {
            $customers = array_values(array_filter($customers, function ($c) use ($type) {
                return strtolower($c['type'] ?? '') === strtolower($type);
            }));
        }

        // Search filter
        if ($search) {
            $search = strtolower(trim($search));
            $customers = array_values(array_filter($customers, function ($c) use ($search) {
                return str_contains(strtolower($c['name']), $search) ||
                       str_contains(strtolower($c['phone'] ?? ''), $search) ||
                       str_contains(strtolower($c['address'] ?? ''), $search) ||
                       str_contains(strtolower($c['email'] ?? ''), $search);
            }));
        }

        // Sorting
        usort($customers, function ($a, $b) use ($sortBy, $sortOrder) {
            $valA = $a[$sortBy] ?? '';
            $valB = $b[$sortBy] ?? '';

            if (is_numeric($valA) && is_numeric($valB)) {
                $res = $valA <=> $valB;
            } else {
                $res = strcasecmp((string)$valA, (string)$valB);
            }

            return strtolower($sortOrder) === 'desc' ? -$res : $res;
        });

        return $customers;
    }

    public function getCustomerDetails(string $id): ?array
    {
        $customer = $this->customerRepo->find($id);
        if (!$customer) {
            return null;
        }

        $allTrx = $this->transactionRepo->all();
        $customerTrx = array_values(array_filter($allTrx, function ($trx) use ($id) {
            return ($trx['customer_id'] ?? '') === $id;
        }));

        // Sort transactions descending by date
        usort($customerTrx, function ($a, $b) {
            return strtotime($b['date'] ?? $b['created_at']) <=> strtotime($a['date'] ?? $a['created_at']);
        });

        $totalWeight = 0;
        $totalAmount = 0;
        $wasteTypeSummary = [];

        foreach ($customerTrx as $trx) {
            $totalWeight += (float) ($trx['total_weight'] ?? 0);
            $totalAmount += (float) ($trx['total_amount'] ?? 0);

            if (isset($trx['items']) && is_array($trx['items'])) {
                foreach ($trx['items'] as $item) {
                    $wName = $item['waste_name'] ?? 'Unknown';
                    if (!isset($wasteTypeSummary[$wName])) {
                        $wasteTypeSummary[$wName] = [
                            'name' => $wName,
                            'weight' => 0,
                            'subtotal' => 0,
                        ];
                    }
                    $wasteTypeSummary[$wName]['weight'] += (float) ($item['weight'] ?? 0);
                    $wasteTypeSummary[$wName]['subtotal'] += (float) ($item['subtotal'] ?? 0);
                }
            }
        }

        $customer['total_transactions'] = count($customerTrx);
        $customer['total_weight_kg'] = round($totalWeight, 2);
        $customer['total_value_idr'] = $totalAmount;
        $customer['transactions'] = $customerTrx;
        $customer['waste_breakdown'] = array_values($wasteTypeSummary);

        return $customer;
    }

    public function createCustomer(array $data): array
    {
        return $this->customerRepo->create([
            'name' => trim($data['name']),
            'email' => trim($data['email'] ?? ''),
            'phone' => trim($data['phone']),
            'address' => trim($data['address']),
            'type' => $data['type'] ?? 'Individual',
            'status' => $data['status'] ?? 'active',
            'registration_date' => $data['registration_date'] ?? date('Y-m-d'),
        ]);
    }

    public function updateCustomer(string $id, array $data): ?array
    {
        $existing = $this->customerRepo->find($id);
        if (!$existing) {
            return null;
        }

        return $this->customerRepo->update($id, [
            'name' => trim($data['name'] ?? $existing['name']),
            'email' => trim($data['email'] ?? ($existing['email'] ?? '')),
            'phone' => trim($data['phone'] ?? $existing['phone']),
            'address' => trim($data['address'] ?? $existing['address']),
            'type' => $data['type'] ?? ($existing['type'] ?? 'Individual'),
            'status' => $data['status'] ?? ($existing['status'] ?? 'active'),
        ]);
    }

    public function deleteCustomer(string $id): array
    {
        $customer = $this->customerRepo->find($id);
        if (!$customer) {
            return [
                'success' => false,
                'message' => 'Nasabah/Customer tidak ditemukan.',
                'status' => 404,
            ];
        }

        $allTrx = $this->transactionRepo->all();
        $linked = array_filter($allTrx, function ($trx) use ($id) {
            return ($trx['customer_id'] ?? '') === $id;
        });

        if (count($linked) > 0) {
            return [
                'success' => false,
                'message' => sprintf(
                    'Tidak dapat menghapus nasabah "%s" karena memiliki riwayat %d transaksi. Status nasabah dapat dinonaktifkan.',
                    $customer['name'],
                    count($linked)
                ),
                'status' => 422,
            ];
        }

        $deleted = $this->customerRepo->delete($id);
        return [
            'success' => $deleted,
            'message' => $deleted ? 'Nasabah berhasil dihapus.' : 'Gagal menghapus data nasabah.',
            'status' => $deleted ? 200 : 500,
        ];
    }
}

