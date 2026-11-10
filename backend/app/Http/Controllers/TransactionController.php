<?php

namespace App\Http\Controllers;

use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $customerId = $request->query('customer_id');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $transactions = $this->transactionService->getAllTransactions($search, $customerId, $startDate, $endDate);

        return response()->json([
            'success' => true,
            'message' => 'Daftar transaksi berhasil dimuat.',
            'data' => $transactions,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $transaction = $this->transactionService->getTransactionById($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail transaksi berhasil dimuat.',
            'data' => $transaction,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        $result = $this->transactionService->createTransaction($request->all(), $authUser);

        return response()->json($result, $result['status'] ?? 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->transactionService->deleteTransaction($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan atau gagal dibatalkan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus dari sistem.',
        ]);
    }
}

