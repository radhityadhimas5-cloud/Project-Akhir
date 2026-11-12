import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Minus,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';
import chatbotAPI from '../../services/chatbotService';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome-0',
  sender: 'assistant',
  text: 'Halo! 👋 Selamat datang di **SampahPay**. Saya adalah **Asisten AI Bank Sampah** yang siap membantu kamu.\n\nAda yang ingin kamu tanyakan seputar pengelolaan sampah, prosedur penyetoran, katalog harga acuan, atau cara mendapatkan saldo tabungan?',
  timestamp: new Date().toISOString(),
};

const DEFAULT_SUGGESTIONS = [
  'Bagaimana cara menyetorkan sampah?',
  'Apa saja jenis sampah yang bisa didaur ulang?',
  'Bagaimana cara mendapatkan saldo?',
  'Bagaimana cara menghitung nilai sampah?',
  'Apa manfaat Bank Sampah?',
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  // Load chat history from sessionStorage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sampahpay_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom on new messages or typing state
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('sampahpay_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setShowTooltip(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  // Send a message
  const handleSendMessage = async (textToSend) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || loading) return;

    setError(null);
    setInputMessage('');

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Prepare history formatted for backend API
      const historyPayload = updatedMessages
        .slice(-10) // last 10 messages for context
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const res = await chatbotAPI.sendMessage(messageText, historyPayload);

      const replyText = res?.data?.reply || res?.reply;
      if (replyText) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: res?.data?.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMsg]);

        const newSuggestions = res?.data?.suggestions || res?.suggestions;
        if (newSuggestions && newSuggestions.length > 0) {
          setSuggestions(newSuggestions);
        }
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setError('Maaf, tidak dapat terhubung ke server asisten. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    if (window.confirm('Mulai percakapan baru dengan Asisten Bank Sampah?')) {
      const resetMsg = {
        ...DEFAULT_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setMessages([resetMsg]);
      setSuggestions(DEFAULT_SUGGESTIONS);
      setError(null);
    }
  };

  // Handle enter key to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">
      {/* 1. GREETING TOOLTIP (When Chat Window is Closed) */}
      {!isOpen && showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 w-64 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200/90 text-xs text-slate-700 animate-bounce-gentle">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-slate-900 text-xs">Asisten Bank Sampah</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-slate-600 leading-relaxed text-[11px]">
            👋 Butuh bantuan seputar pemilahan sampah, harga daur ulang, atau cara setor? Tanya saya di sini!
          </p>
          {/* Tooltip triangle tail */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-200/90 transform rotate-45"></div>
        </div>
      )}

      {/* 2. CHAT WINDOW MODAL */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isMinimized
              ? 'h-14 w-80'
              : 'w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh]'
            }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/30 shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-700"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  <span>Asisten Bank Sampah</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                </h3>
                <span className="text-[10px] text-emerald-100/90 font-medium block">
                  Online • SampahPay AI Assistant
                </span>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Mulai Percakapan Baru"
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Perbesar' : 'Kecilkan'}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when Minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/70 space-y-1">
                {/* Information Badge */}
                <div className="text-center my-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Didukung Katalog Resmi SampahPay
                  </span>
                </div>

                {/* Messages List */}
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div className="flex items-center gap-2.5 my-2 animate-fadeIn">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2 my-2 animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="font-bold underline text-[11px] hover:text-red-900"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}

                {/* Suggested Questions Pills */}
                {!loading && (
                  <ChatSuggestions
                    suggestions={suggestions}
                    onSelect={(question) => handleSendMessage(question)}
                    disabled={loading}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="Tanya seputar sampah atau daur ulang..."
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400 disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-emerald-600/30 cursor-pointer flex-shrink-0"
                    aria-label="Kirim pesan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-2 text-center">
                  <span className="text-[10px] text-slate-400">
                    💡 Asisten AI resmi Bank Sampah • Hotline 0811-4455-667
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. FLOATING ACTION BUTTON (TRIGGER) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 active:scale-95 text-white shadow-xl shadow-emerald-600/35 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          aria-label="Buka Asisten AI Bank Sampah"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
        </button>
      )}
    </div>
  );
}

