<?php

namespace App\Http\Controllers;

use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected CustomerService $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $type = $request->query('type');
        $sortBy = $request->query('sort_by', 'name');
        $sortOrder = $request->query('sort_order', 'asc');

        $customers = $this->customerService->getAllCustomers($search, $type, $sortBy, $sortOrder);

        return response()->json([
            'success' => true,
            'message' => 'Daftar nasabah berhasil dimuat.',
            'data' => $customers,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $customer = $this->customerService->getCustomerDetails($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Nasabah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail nasabah beserta riwayat transaksi berhasil diambil.',
            'data' => $customer,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = $request->input('name');
        $phone = $request->input('phone');
        $address = $request->input('address');

        $errors = [];
        if (empty($name)) {
            $errors['name'] = ['Nama lengkap nasabah wajib diisi.'];
        }
        if (empty($phone)) {
            $errors['phone'] = ['Nomor telepon wajib diisi.'];
        }
        if (empty($address)) {
            $errors['address'] = ['Alamat nasabah wajib diisi.'];
        }

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $errors,
            ], 422);
        }

        $customer = $this->customerService->createCustomer($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Nasabah baru berhasil didaftarkan.',
            'data' => $customer,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $customer = $this->customerService->updateCustomer($id, $request->all());

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Nasabah tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data nasabah berhasil diperbarui.',
            'data' => $customer,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $result = $this->customerService->deleteCustomer($id);

        return response()->json($result, $result['status'] ?? 200);
    }
}

