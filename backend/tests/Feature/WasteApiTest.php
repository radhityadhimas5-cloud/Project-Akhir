<?php

namespace Tests\Feature;

use Tests\TestCase;

class WasteApiTest extends TestCase
{
    public function test_api_status_endpoint()
    {
        $response = $this->getJson('/api/status');
        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'connected' => true,
                 ]);
    }

    public function test_admin_login()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@mallsampah.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         'token',
                         'user' => ['id', 'name', 'email', 'role'],
                     ],
                 ]);
    }

    public function test_dashboard_data_retrieval()
    {
        $login = $this->postJson('/api/auth/login', [
            'email' => 'admin@mallsampah.com',
            'password' => 'password123',
        ]);
        $token = $login->json('data.token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->getJson('/api/dashboard');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'metrics',
                         'charts',
                         'recent_transactions',
                         'top_customers',
                     ],
                 ]);
    }

    public function test_waste_crud_operations()
    {
        $login = $this->postJson('/api/auth/login', [
            'email' => 'admin@mallsampah.com',
            'password' => 'password123',
        ]);
        $token = $login->json('data.token');

        // 1. Get Waste List
        $listResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                             ->getJson('/api/waste');
        $listResponse->assertStatus(200);

        // 2. Create Waste
        $createResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                               ->postJson('/api/waste', [
                                   'name' => 'Kabel Tembaga Daur Ulang',
                                   'category_id' => 'CAT-003',
                                   'price_per_kg' => 65000,
                                   'description' => 'Kabel tembaga kupasan bersih siap lebur.',
                               ]);
        $createResponse->assertStatus(201);
        $newId = $createResponse->json('data.id');

        // 3. Update Waste
        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                               ->putJson('/api/waste/' . $newId, [
                                   'price_per_kg' => 70000,
                               ]);
        $updateResponse->assertStatus(200);

        // 4. Delete Waste
        $deleteResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                               ->deleteJson('/api/waste/' . $newId);
        $deleteResponse->assertStatus(200);
    }

    public function test_transaction_creation_and_auto_calculation()
    {
        $login = $this->postJson('/api/auth/login', [
            'email' => 'staff@mallsampah.com',
            'password' => 'password123',
        ]);
        $token = $login->json('data.token');

        $trxData = [
            'customer_id' => 'CUST-001',
            'items' => [
                [
                    'waste_id' => 'WST-001', // Rp 4.500/kg
                    'weight' => 10,           // Expected subtotal = 45.000
                ],
                [
                    'waste_id' => 'WST-004', // Rp 2.200/kg
                    'weight' => 5,            // Expected subtotal = 11.000
                ],
            ],
            'notes' => 'Uji coba transaksi dari test automated',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/transactions', $trxData);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'customer_id' => 'CUST-001',
                         'total_weight' => 15,
                         'total_amount' => 56000, // 45000 + 11000
                     ],
                 ]);
    }
}

