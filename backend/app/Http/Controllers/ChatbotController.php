<?php

namespace App\Http\Controllers;

use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    protected ChatbotService $chatbotService;

    public function __construct(ChatbotService $chatbotService)
    {
        $this->chatbotService = $chatbotService;
    }

    /**
     * Handle incoming chat message from user (supports /api/chatbot/message).
     */
    public function chat(Request $request): JsonResponse
    {
        return $this->processMessage($request);
    }

    /**
     * Alias for chat method.
     */
    public function sendMessage(Request $request): JsonResponse
    {
        return $this->processMessage($request);
    }

    /**
     * Core message processor with Gemini Free Tier optimization and local fallback.
     */
    protected function processMessage(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'history' => 'nullable|array',
        ]);

        $userMessage = trim($request->input('message'));
        $history = $request->input('history', []);

        // Resolve API key from config/services, config/chatbot, or .env
        $apiKey = config('services.gemini.key') 
            ?: config('chatbot.gemini_api_key') 
            ?: env('GEMINI_API_KEY');

        // Gemini Free Tier optimized model chain (models supported on free tier without 404 or 503 bottlenecks)
        $modelsToTry = [
            'gemini-3.1-flash-lite-preview',
            'gemini-3.1-flash-lite',
            'gemini-3.5-flash-lite',
        ];

        // Build official system instruction with real-time waste prices
        $systemPrompt = $this->chatbotService->buildSystemPrompt();

        $reply = null;
        $usedProvider = null;

        if (!empty($apiKey)) {
            // Build conversation contents
            $contents = [];
            foreach ($history as $h) {
                $role = ($h['sender'] ?? '') === 'user' ? 'user' : 'model';
                $text = $h['text'] ?? '';
                if (!empty($text)) {
                    $contents[] = [
                        'role' => $role,
                        'parts' => [['text' => $text]],
                    ];
                }
            }
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

            // Attempt calling Gemini models in order of speed and stability
            foreach ($modelsToTry as $model) {
                try {
                    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
                    $response = Http::withHeaders([
                        'x-goog-api-key' => $apiKey,
                        'Content-Type' => 'application/json',
                    ])->timeout(12)->post($url, $payload);

                    if ($response->successful()) {
                        $json = $response->json();
                        $candidateText = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;
                        if (!empty($candidateText)) {
                            $reply = $candidateText;
                            $usedProvider = "gemini ({$model})";
                            break;
                        }
                    } else {
                        Log::warning("Gemini model {$model} failed with HTTP " . $response->status() . ": " . substr($response->body(), 0, 150));
                    }
                } catch (\Throwable $e) {
                    Log::warning("Gemini model {$model} exception: " . $e->getMessage());
                }
            }
        }

        // If Gemini is unavailable, rate-limited, or offline, seamlessly use the Knowledge Engine
        if (empty($reply)) {
            $fallback = $this->chatbotService->generateContextualFallback($userMessage);
            $reply = $fallback['reply'];
            $usedProvider = 'knowledge-engine';
        }

        $suggestions = $this->deriveSuggestions($userMessage);

        return response()->json([
            'status' => 'success',
            'reply' => $reply,
            'data' => [
                'reply' => $reply,
                'suggestions' => $suggestions,
                'provider' => $usedProvider,
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Get default suggested questions & bot metadata.
     */
    public function suggestions(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'bot_name' => 'Asisten Bank Sampah',
                'platform' => config('chatbot.platform_name', 'SampahPay'),
                'status' => 'online',
                'greeting' => 'Halo! 👋 Selamat datang di SampahPay. Saya adalah Asisten AI Bank Sampah yang siap membantu kamu. Ada yang ingin kamu tanyakan seputar pengelolaan sampah, penyetoran sampah, katalog harga, atau informasi lainnya?',
                'suggested_questions' => config('chatbot.suggested_questions', [
                    'Bagaimana cara menyetorkan sampah?',
                    'Apa saja jenis sampah yang bisa didaur ulang?',
                    'Bagaimana cara mendapatkan saldo?',
                    'Bagaimana cara menghitung nilai sampah?',
                    'Apa manfaat Bank Sampah?',
                ]),
                'hotline' => config('chatbot.hotline', '0811-4455-667'),
            ],
        ]);
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

        return config('chatbot.suggested_questions', [
            'Bagaimana cara menyetorkan sampah?',
            'Apa saja jenis sampah yang bisa didaur ulang?',
            'Bagaimana cara mendapatkan saldo?',
            'Bagaimana cara menghitung nilai sampah?',
            'Apa manfaat Bank Sampah?',
        ]);
    }
}
