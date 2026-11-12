<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Chatbot Provider & Credentials
    |--------------------------------------------------------------------------
    | Supported providers: 'gemini', 'openai', 'local'
    | If the external API key is empty or API request fails, the service
    | automatically falls back to the intelligent built-in NLP knowledge engine.
    */
    'provider' => env('AI_PROVIDER', 'gemini'),

    'model' => env('AI_MODEL', 'gemini-3.1-flash-lite-preview'),

    'gemini_fallback_models' => [
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash-lite',
    ],

    'gemini_api_key' => env('GEMINI_API_KEY', ''),

    'openai_api_key' => env('OPENAI_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Official Platform Information
    |--------------------------------------------------------------------------
    */
    'platform_name' => 'SampahPay',
    'tagline' => 'Bank Sampah Digital & Jaringan Daur Ulang Terintegrasi',
    'administrator_name' => 'Radhitya Dhimas Ardyansyah',
    'staff_name' => 'Imania Ambarwati',
    'hotline' => '0811-4455-667',
    'email' => 'contact@sampahpay.com',
    'support_email' => 'info@sampahpay.com',
    'office_address' => 'Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160',

    /*
    |--------------------------------------------------------------------------
    | Default Suggested Questions for Users
    |--------------------------------------------------------------------------
    */
    'suggested_questions' => [
        'Bagaimana cara menyetorkan sampah?',
        'Apa saja jenis sampah yang bisa didaur ulang?',
        'Bagaimana cara mendapatkan saldo?',
        'Bagaimana cara menghitung nilai sampah?',
        'Apa manfaat Bank Sampah?',
    ],
];

