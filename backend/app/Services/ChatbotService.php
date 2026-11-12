<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Repositories\SettingRepository;
use App\Repositories\WasteRepository;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
    protected WasteRepository $wasteRepo;
    protected CategoryRepository $categoryRepo;
    protected SettingRepository $settingRepo;

    public function __construct(
        WasteRepository $wasteRepo,
        CategoryRepository $categoryRepo,
        SettingRepository $settingRepo
    ) {
        $this->wasteRepo = $wasteRepo;
        $this->categoryRepo = $categoryRepo;
        $this->settingRepo = $settingRepo;
    }

    /**
     * Generate response for user chat message.
     */
    public function generateResponse(string $userMessage, array $chatHistory = []): array
    {
        $userMessage = trim($userMessage);
        if (empty($userMessage)) {
            return [
                'reply' => 'Halo! Ada yang bisa saya bantu seputar pengelolaan sampah dan layanan SampahPay? 😊',
                'suggestions' => config('chatbot.suggested_questions'),
                'provider' => 'system',
            ];
        }

        // Try External LLM if configured
        $provider = config('chatbot.provider', 'gemini');
        $geminiKey = config('chatbot.gemini_api_key');
        $openaiKey = config('chatbot.openai_api_key');

        if ($provider === 'gemini' && !empty($geminiKey)) {
            try {
                $response = $this->callGeminiApi($userMessage, $chatHistory, $geminiKey);
                if ($response) {
                    return $response;
                }
            } catch (\Throwable $e) {
                Log::warning('Gemini API call failed, falling back to Knowledge Engine: ' . $e->getMessage());
            }
        } elseif ($provider === 'openai' && !empty($openaiKey)) {
            try {
                $response = $this->callOpenAiApi($userMessage, $chatHistory, $openaiKey);
                if ($response) {
                    return $response;
                }
            } catch (\Throwable $e) {
                Log::warning('OpenAI API call failed, falling back to Knowledge Engine: ' . $e->getMessage());
            }
        }

        // Contextual Knowledge Engine
        return $this->generateContextualFallback($userMessage);
    }

    /**
     * Build system prompt with live repository data.
     */
    public function buildSystemPrompt(): string
    {
        $wasteItems = $this->wasteRepo->all();
        $categories = $this->categoryRepo->all();

        $catMap = [];
        foreach ($categories as $c) {
            $catMap[$c['id']] = $c['name'];
        }

        $catalogText = '';
        foreach ($wasteItems as $w) {
            $catName = $catMap[$w['category_id'] ?? ''] ?? 'Lainnya';
            $priceFmt = 'Rp ' . number_format($w['price_per_kg'] ?? 0, 0, ',', '.');
            $catalogText .= "- {$w['name']} (Kategori: {$catName}): {$priceFmt}/{$w['unit']}. Keterangan: {$w['description']}\n";
        }

        $adminName = config('chatbot.administrator_name', 'Radhitya Dhimas Ardyansyah');
        $staffName = config('chatbot.staff_name', 'Imania Ambarwati');
        $hotline = config('chatbot.hotline', '0811-4455-667');
        $email = config('chatbot.email', 'contact@sampahpay.com');

        return <<<EOT
Anda adalah "Asisten Bank Sampah" (Asisten AI resmi SampahPay).
Peran Anda adalah asisten virtual cerdas, ramah, profesional, dan edukatif khusus untuk platform Bank Sampah SampahPay.

IDENTITAS & TIM:
- Platform: SampahPay (Bank Sampah Digital & Jaringan Daur Ulang Terintegrasi).
- Administrator: {$adminName}
- Staff Operasional: {$staffName}
- Hotline / WhatsApp: {$hotline}
- Email Resmi: {$email}

DAFTAR HARGA SAMPAH RESMI TERBARU (SISTEM SAMPAHPAY):
{$catalogText}

ATURAN DAN BATASAN KETAT:
1. Jawab selalu dalam Bahasa Indonesia yang santun, ramah, jelas, dan mudah dipahami masyarakat umum. Gunakan emoji pendukung secara natural.
2. HANYA berikan informasi seputar Bank Sampah, daur ulang, klasifikasi sampah, prosedur penyetoran, perhitungan saldo, dan edukasi lingkungan (3R).
3. JANGAN PERNAH mengarang harga sampah atau saldo di luar daftar harga resmi di atas. Jika sampah tidak ada di daftar, jelaskan bahwa harga harus dikonfirmasi langsung dengan Administrator ({$adminName}) atau Staff ({$staffName}).
4. JANGAN PERNAH mengklaim dapat mengakses atau mengubah saldo akun secara langsung lewat chat.
5. JANGAN PERNAH mengklaim transaksi telah selesai dieksekusi via chat. Penyetoran resmi harus ditimbang dan diverifikasi oleh petugas resmi SampahPay dengan timbangan digital dan struk resmi.
6. Alur penyetoran resmi:
   a. Pilah sampah berdasarkan kategori.
   b. Bersihkan dan keringkan sampah.
   c. Bawa ke titik Drop Off/Bank Sampah atau jadwalkan Pick Up.
   d. Ditimbang dan diverifikasi oleh petugas.
   e. Nilai sampah dihitung otomatis sesuai acuan harga per kg.
   f. Saldo tabungan pengguna diperbarui dan dicetak struk resmi.
7. Jika ditanya hal di luar topik daur ulang atau bank sampah, tolak dengan sopan dan arahkan kembali ke layanan SampahPay.
EOT;
    }

    /**
     * Call Gemini API with Free-Tier Resilient Multi-Model Fallback Chain.
     */
    protected function callGeminiApi(string $userMessage, array $chatHistory, string $apiKey): ?array
    {
        $systemPrompt = $this->buildSystemPrompt();
        $primaryModel = config('chatbot.model', 'gemini-3.1-flash-lite-preview');
        $fallbackModels = config('chatbot.gemini_fallback_models', [
            'gemini-3.1-flash-lite',
            'gemini-3.5-flash-lite',
        ]);
        $modelsToTry = array_unique(array_merge([$primaryModel], $fallbackModels));

        $contents = [];

        // Add history
        foreach ($chatHistory as $msg) {
            $role = ($msg['sender'] === 'user') ? 'user' : 'model';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $msg['text'] ?? '']],
            ];
        }

        // Add current user message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 800,
            ],
        ];

        foreach ($modelsToTry as $model) {
            try {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
                $response = Http::timeout(18)->post($url, $payload);

                if ($response->successful()) {
                    $data = $response->json();
                    $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
                    if (!empty($reply)) {
                        return [
                            'reply' => $reply,
                            'suggestions' => $this->deriveSuggestions($userMessage),
                            'provider' => 'gemini (' . $model . ')',
                        ];
                    }
                } else {
                    Log::warning("Gemini model {$model} returned HTTP " . $response->status() . ": " . substr($response->body(), 0, 150));
                }
            } catch (\Throwable $e) {
                Log::warning("Gemini model {$model} request exception: " . $e->getMessage());
            }
        }

        return null;
    }

    /**
     * Call OpenAI API.
     */
    protected function callOpenAiApi(string $userMessage, array $chatHistory, string $apiKey): ?array
    {
        $systemPrompt = $this->buildSystemPrompt();
        $url = 'https://api.openai.com/v1/chat/completions';

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($chatHistory as $msg) {
            $role = ($msg['sender'] === 'user') ? 'user' : 'assistant';
            $messages[] = ['role' => $role, 'content' => $msg['text'] ?? ''];
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];

        $response = Http::withToken($apiKey)->timeout(10)->post($url, [
            'model' => config('chatbot.model', 'gpt-4o-mini'),
            'messages' => $messages,
            'temperature' => 0.4,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $reply = $data['choices'][0]['message']['content'] ?? null;
            if ($reply) {
                return [
                    'reply' => $reply,
                    'suggestions' => $this->deriveSuggestions($userMessage),
                    'provider' => 'openai',
                ];
            }
        }

        return null;
    }

    /**
     * Intelligent Knowledge & NLP Engine (Robust Fallback & Standalone).
     */
    public function generateContextualFallback(string $userMessage): array
    {
        $lower = strtolower($userMessage);
        $wasteItems = $this->wasteRepo->all();
        $adminName = config('chatbot.administrator_name', 'Radhitya Dhimas Ardyansyah');
        $staffName = config('chatbot.staff_name', 'Imania Ambarwati');
        $hotline = config('chatbot.hotline', '0811-4455-667');
        $email = config('chatbot.email', 'contact@sampahpay.com');

        // Helper to format price
        $formatPrice = function ($amount) {
            return 'Rp ' . number_format($amount, 0, ',', '.');
        };

        // 1. Greetings / Salam
        if (preg_match('/\b(halo|hai|pagi|siang|sore|malam|assalamu|permisi|hello|hi)\b/i', $lower)) {
            $reply = "Halo! 👋 Selamat datang di **SampahPay**. Saya adalah **Asisten Bank Sampah** yang siap membantu kamu.\n\n"
                . "Ada yang ingin kamu tanyakan seputar:\n"
                . "• Cara dan prosedur penyetoran sampah\n"
                . "• Jenis sampah yang diterima & cara memilahnya\n"
                . "• Daftar harga acuan sampah terbaru per kilogram\n"
                . "• Cara penghitungan saldo tabungan sampah\n"
                . "• Edukasi lingkungan & program 3R\n\n"
                . "Silakan tanyakan atau pilih salah satu menu pertanyaan di bawah ya! 😊";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Bagaimana cara menyetorkan sampah?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Berapa harga sampah saat ini?',
                    'Bagaimana cara mendapatkan saldo?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 2. Prosedur Penyetoran Sampah (Deposit Assistant)
        if (
            str_contains($lower, 'setor') ||
            str_contains($lower, 'cara kerja') ||
            str_contains($lower, 'prosedur') ||
            str_contains($lower, 'menyetor') ||
            str_contains($lower, 'jemput') ||
            str_contains($lower, 'pick up') ||
            str_contains($lower, 'drop off')
        ) {
            $reply = "Berikut adalah **6 langkah mudah prosedur penyetoran sampah** di SampahPay:\n\n"
                . "1. **Pilah Sampah**: Pisahkan sampah rumah tangga atau usaha Anda sesuai kategori (plastik, kertas, logam, kaca, minyak jelantah, organik).\n"
                . "2. **Bersihkan & Keringkan**: Pastikan botol/kaleng dibilas bersih tanpa sisa cairan, dan kardus dilipat rapi dalam kondisi kering.\n"
                . "3. **Pilih Metode Penyetoran**:\n"
                . "   • **Drop Off**: Bawa langsung ke titik Unit Bank Sampah terdekat.\n"
                . "   • **Pick Up**: Jadwalkan penjemputan armada resmi SampahPay ke lokasi Anda (min. 10 kg).\n"
                . "4. **Penimbangan Digital**: Sampah ditimbang secara transparan dan diverifikasi oleh petugas resmi kami.\n"
                . "5. **Kalkulasi Otomatis**: Nilai total dihitung otomatis oleh sistem sesuai harga per kilogram (Rp/kg) yang berlaku.\n"
                . "6. **Pencatatan Saldo & Struk**: Saldo tabungan Anda otomatis bertambah dan Anda menerima bukti struk resmi.\n\n"
                . "⚠️ *Catatan: Transaksi penyetoran tidak dapat diselesaikan melalui chat ini, melainkan harus ditimbang langsung oleh petugas lapangan kami.*";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Berapa harga sampah saat ini?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Bagaimana cara mendapatkan saldo?',
                    'Hubungi petugas penjemputan',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 3. Harga Sampah (Waste Price Information)
        if (
            str_contains($lower, 'harga') ||
            str_contains($lower, 'tarif') ||
            str_contains($lower, 'berapa') ||
            str_contains($lower, 'katalog') ||
            str_contains($lower, 'rupiah') ||
            str_contains($lower, 'rp/kg')
        ) {
            // Check if asking about specific material
            $matchedItems = [];
            foreach ($wasteItems as $item) {
                $keywords = explode(' ', strtolower($item['name']));
                foreach ($keywords as $kw) {
                    if (strlen($kw) > 3 && str_contains($lower, $kw)) {
                        $matchedItems[] = $item;
                        break;
                    }
                }
            }

            if (!empty($matchedItems)) {
                $reply = "Berikut informasi harga resmi untuk jenis sampah yang kamu tanyakan:\n\n";
                foreach ($matchedItems as $m) {
                    $reply .= "• **{$m['name']}**: **{$formatPrice($m['price_per_kg'])} / {$m['unit']}**\n"
                        . "  *Keterangan*: {$m['description']}\n\n";
                }
                $reply .= "💡 *Harga di atas adalah standar resmi di sistem SampahPay. Jika kamu memiliki jenis sampah lain di luar daftar, silakan konfirmasi dengan Administrator ({$adminName}) atau Staff ({$staffName}).*";
            } else {
                $reply = "Berikut adalah **daftar acuan harga sampah resmi** di SampahPay saat ini:\n\n";
                foreach ($wasteItems as $w) {
                    $reply .= "• **{$w['name']}**: **{$formatPrice($w['price_per_kg'])} / {$w['unit']}**\n";
                }
                $reply .= "\n⚖️ *Semua penimbangan menggunakan timbangan digital presisi. Nilai total = Berat (kg) × Harga per kg.*";
            }

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Bagaimana cara menghitung nilai sampah?',
                    'Bagaimana cara menyetorkan sampah?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Bagaimana cara mendapatkan saldo?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 4. Jenis Sampah & Klasifikasi (Waste Classification Assistant)
        if (
            str_contains($lower, 'jenis') ||
            str_contains($lower, 'kategori') ||
            str_contains($lower, 'plastik') ||
            str_contains($lower, 'kertas') ||
            str_contains($lower, 'kardus') ||
            str_contains($lower, 'logam') ||
            str_contains($lower, 'kaleng') ||
            str_contains($lower, 'besi') ||
            str_contains($lower, 'kaca') ||
            str_contains($lower, 'minyak') ||
            str_contains($lower, 'jelantah') ||
            str_contains($lower, 'organik') ||
            str_contains($lower, 'elektronik') ||
            str_contains($lower, 'klasifikasi')
        ) {
            $reply = "SampahPay menerima dan mengklasifikasikan sampah ke dalam beberapa kategori bernilai ekonomi:\n\n"
                . "1. **Plastik**:\n"
                . "   • *Contoh*: Botol PET bening, gelas PP kopi, jerigen HDPE sampo/sabun.\n"
                . "   • *Cara pilah*: Kosongkan cairan, bilas bersih, lepas tutup & label jika bisa, pres agar ringkas.\n\n"
                . "2. **Kertas & Karton**:\n"
                . "   • *Contoh*: Kardus gelombang kemasan paket, kertas HVS arsip, koran/buku.\n"
                . "   • *Cara pilah*: Pastikan kering (tidak basah/berminyak), lepas selotip berlebih dan staples.\n\n"
                . "3. **Logam & Alumunium**:\n"
                . "   • *Contoh*: Kaleng minuman soda, besi paku konstruksi, seng perabot.\n"
                . "   • *Cara pilah*: Bersihkan dari sisa cairan/noda tanah, pipihkan kaleng agar hemat tempat.\n\n"
                . "4. **Kaca**:\n"
                . "   • *Contoh*: Botol kecap, sirup, toples kaca utuh.\n"
                . "   • *Cara pilah*: Cuci bersih bagian dalam, pisahkan botol utuh dan jangan sampai pecah.\n\n"
                . "5. **Minyak Jelantah**:\n"
                . "   • *Contoh*: Minyak goreng bekas pakai dari rumah tangga/restoran.\n"
                . "   • *Cara pilah*: Dinginkan, saring remahan makanan, masukkan ke jerigen/botol tertutup rapat (disalurkan untuk biodiesel).\n\n"
                . "6. **Organik**:\n"
                . "   • *Contoh*: Sisa sayuran mentah dapur, kulit buah, dedaunan untuk pakan maggot / kompos.\n\n"
                . "7. **Limbah Elektronik (E-Waste)**:\n"
                . "   • Dapat dikonsultasikan khusus ke pengurus untuk penanganan aman.";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Berapa harga sampah saat ini?',
                    'Bagaimana cara menyetorkan sampah?',
                    'Bagaimana cara menghitung nilai sampah?',
                    'Apa manfaat daur ulang bagi lingkungan?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 5. Perhitungan Nilai Sampah (Calculation Assistant)
        if (
            str_contains($lower, 'hitung') ||
            str_contains($lower, 'kalkulasi') ||
            str_contains($lower, 'nilai') ||
            str_contains($lower, 'rumus') ||
            str_contains($lower, 'simulasi')
        ) {
            $reply = "Menghitung nilai sampah di SampahPay sangat mudah dan transparan! 📊\n\n"
                . "**Rumus Penghitungan**:\n"
                . "```\nTotal Nilai (Rp) = Berat Sampah (kg) × Harga Resmi per kg (Rp/kg)\n```\n\n"
                . "**Contoh Simulasi**:\n"
                . "• Kamu menyetor **15 kg Kardus Bekas** (Rp 2.200/kg) = **Rp 33.000**\n"
                . "• Ditambah **10 kg Botol Plastik PET** (Rp 4.500/kg) = **Rp 45.000**\n"
                . "• Ditambah **5 kg Minyak Jelantah** (Rp 7.500/kg) = **Rp 37.500**\n"
                . "• **Total Saldo yang Diterima = Rp 115.500**! 🎉\n\n"
                . "Kamu juga bisa mencoba fitur **Kalkulator Tabungan Sampah** interaktif langsung di Beranda website SampahPay!";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Berapa harga sampah saat ini?',
                    'Bagaimana cara mendapatkan saldo?',
                    'Bagaimana cara menyetorkan sampah?',
                    'Apa manfaat Bank Sampah?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 6. Saldo, Tabungan, dan Pencairan (Balance & Rewards Assistant)
        if (
            str_contains($lower, 'saldo') ||
            str_contains($lower, 'tabungan') ||
            str_contains($lower, 'cair') ||
            str_contains($lower, 'uang') ||
            str_contains($lower, 'tarik') ||
            str_contains($lower, 'poin') ||
            str_contains($lower, 'dapat saldo')
        ) {
            $reply = "Di SampahPay, setiap sampah yang kamu setorkan akan langsung dikonversi menjadi **Saldo Tabungan Rupiah**! 💰\n\n"
                . "**Bagaimana cara kerjanya?**\n"
                . "1. Setelah sampah ditimbang dan diverifikasi oleh petugas, nilai rupiahnya otomatis tercatat di data nasabah Anda.\n"
                . "2. Anda menerima struk resmi fisik maupun catatan digital.\n"
                . "3. Saldo terakumulasi di akun nasabah dan dapat dilihat riwayatnya melalui laporan transaksi.\n"
                . "4. **Pencairan Saldo**: Saldo dapat dicairkan secara tunai langsung di kasir unit Bank Sampah atau ditransfer ke rekening/e-wallet Anda sesuai kesepakatan mitra.\n\n"
                . "⚠️ *Asisten AI tidak dapat mengecek saldo pribadi atau melakukan penarikan secara mandiri demi keamanan akun Anda. Silakan hubungi kasir/petugas resmi SampahPay untuk proses pencairan.*";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Bagaimana cara menyetorkan sampah?',
                    'Berapa harga sampah saat ini?',
                    'Bagaimana cara menghitung nilai sampah?',
                    'Apa manfaat Bank Sampah?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 7. Manfaat Bank Sampah & Edukasi Lingkungan (3R)
        if (
            str_contains($lower, 'manfaat') ||
            str_contains($lower, 'tujuan') ||
            str_contains($lower, 'edukasi') ||
            str_contains($lower, 'lingkungan') ||
            str_contains($lower, '3r') ||
            str_contains($lower, 'reduce') ||
            str_contains($lower, 'reuse') ||
            str_contains($lower, 'recycle') ||
            str_contains($lower, 'apa itu bank sampah') ||
            str_contains($lower, 'kenapa')
        ) {
            $reply = "Bergabung dengan Bank Sampah SampahPay membawa banyak manfaat nyata bagi kamu dan lingkungan: 🌱\n\n"
                . "1. **Manfaat Ekonomi**: Mengubah barang yang tadinya dianggap limbah menjadi tabungan uang tunai yang bermanfaat.\n"
                . "2. **Mengurangi Beban TPA**: Sampah yang didaur ulang tidak menumpuk di Tempat Pembuangan Akhir dan mencegah pencemaran tanah serta laut.\n"
                . "3. **Menerapkan Prinsip 3R**:\n"
                . "   • **Reduce**: Mengurangi penggunaan kemasan sekali pakai.\n"
                . "   • **Reuse**: Memanfaatkan kembali barang yang masih layak pakai.\n"
                . "   • **Recycle**: Mengolah sampah material menjadi produk baru berkualitas.\n"
                . "4. **Mengurangi Jejak Karbon**: Mendaur ulang 1 kg sampah plastik rata-rata mencegah ~1.5 kg emisi gas rumah kaca (CO₂).\n"
                . "5. **Menciptakan Lingkungan Bersih & Sehat**: Rumah dan lingkungan sekitar bebas dari timbunan sampah dan bau tak sedap.";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Bagaimana cara menyetorkan sampah?',
                    'Berapa harga sampah saat ini?',
                    'Bagaimana cara mendapatkan saldo?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 8. Akun, Registrasi, Login & Panduan Pengguna (User Guidance)
        if (
            str_contains($lower, 'daftar') ||
            str_contains($lower, 'registrasi') ||
            str_contains($lower, 'login') ||
            str_contains($lower, 'masuk') ||
            str_contains($lower, 'akun') ||
            str_contains($lower, 'password') ||
            str_contains($lower, 'dashboard')
        ) {
            $reply = "Berikut panduan akses akun di platform SampahPay: 🔐\n\n"
                . "• **Portal Masuk (Login)**:\n"
                . "  Petugas dan Administrator dapat masuk melalui menu **'Portal Admin'** atau halaman `/login` menggunakan email resmi (contoh: `admin@sampahpay.com` atau `staff@sampahpay.com`).\n\n"
                . "• **Pendaftaran Nasabah Baru**:\n"
                . "  Untuk masyarakat atau pelaku usaha yang ingin menjadi nasabah terdaftar, pendaftaran dilakukan langsung oleh petugas Bank Sampah saat penyetoran pertama atau dengan menghubungi kontak layanan kami.\n\n"
                . "• **Dashboard & Riwayat Transaksi**:\n"
                . "  Di dalam dashboard sistem, petugas dapat mencatat transaksi penyetoran pelanggan, melihat grafik statistik tonase sampah, mengelola katalog harga, dan mencetak laporan ekologis berkala.";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Bagaimana cara menyetorkan sampah?',
                    'Hubungi petugas penjemputan',
                    'Berapa harga sampah saat ini?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 9. Kontak, Alamat, Hotline, dan Operator
        if (
            str_contains($lower, 'kontak') ||
            str_contains($lower, 'hubungi') ||
            str_contains($lower, 'telepon') ||
            str_contains($lower, 'wa') ||
            str_contains($lower, 'whatsapp') ||
            str_contains($lower, 'alamat') ||
            str_contains($lower, 'kantor') ||
            str_contains($lower, 'operator') ||
            str_contains($lower, 'admin')
        ) {
            $reply = "Kamu bisa menghubungi tim resmi SampahPay melalui saluran berikut: 📞\n\n"
                . "• **Hotline / WhatsApp**: `{$hotline}` (Senin - Sabtu: 08.00 - 17.00 WIB)\n"
                . "• **Email Korespondensi**: `{$email}`\n"
                . "• **Email Bantuan**: `info@sampahpay.com`\n"
                . "• **Alamat Kantor Pusat**: Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160\n\n"
                . "👤 **Tim Pengelola Resmi**:\n"
                . "• **Administrator**: {$adminName}\n"
                . "• **Staff Operasional**: {$staffName}\n\n"
                . "Tim kami siap membantu kebutuhan jadwal penjemputan, konsultasi daur ulang kantor/kafe, maupun pendaftaran nasabah!";

            return [
                'reply' => $reply,
                'suggestions' => [
                    'Bagaimana cara menyetorkan sampah?',
                    'Berapa harga sampah saat ini?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Bagaimana cara menghitung nilai sampah?',
                ],
                'provider' => 'knowledge-engine',
            ];
        }

        // 10. Default / Fallback for other queries
        $reply = "Terima kasih atas pertanyaannya! 😊\n\n"
            . "Sebagai **Asisten Bank Sampah SampahPay**, fokus utama saya adalah membantu kamu seputar **pemilahan sampah, daftar harga resmi daur ulang, alur penyetoran, dan penghitungan saldo tabungan sampah**.\n\n"
            . "Apakah ada hal berikut yang ingin kamu ketahui?\n"
            . "1. Prosedur penjemputan & penyetoran sampah\n"
            . "2. Daftar harga acuan material per kilogram (Rp/kg)\n"
            . "3. Cara memilah plastik, kertas, kaleng, atau minyak jelantah\n"
            . "4. Menghubungi customer support resmi SampahPay ({$hotline})";

        return [
            'reply' => $reply,
            'suggestions' => config('chatbot.suggested_questions'),
            'provider' => 'knowledge-engine',
        ];
    }

    /**
     * Contextual dynamic suggestions.
     */
    protected function deriveSuggestions(string $userMessage): array
    {
        $lower = strtolower($userMessage);
        if (str_contains($lower, 'harga')) {
            return [
                'Bagaimana cara menghitung nilai sampah?',
                'Bagaimana cara menyetorkan sampah?',
                'Berapa harga botol plastik PET?',
                'Berapa harga kardus bekas?',
            ];
        }
        if (str_contains($lower, 'setor')) {
            return [
                'Berapa harga sampah saat ini?',
                'Apa saja jenis sampah yang bisa didaur ulang?',
                'Bagaimana cara mendapatkan saldo?',
                'Hubungi hotline penjemputan',
            ];
        }

        return config('chatbot.suggested_questions');
    }
}

