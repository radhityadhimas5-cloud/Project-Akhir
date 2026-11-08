import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { checkBackendStatus } from './services/api'

function App() {
  const [backendData, setBackendData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)

  const testBackendConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await checkBackendStatus()
      setBackendData(data)
      setLastChecked(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err.message || 'Unable to connect to Laravel backend.')
      setBackendData(null)
      setLastChecked(new Date().toLocaleTimeString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Top Header / Status bar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5 items-center">
              <img src={viteLogo} className="w-6 h-6 object-contain" alt="Vite logo" />
              <img src={reactLogo} className="w-6 h-6 object-contain animate-[spin_20s_linear_infinite]" alt="React logo" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-slate-200">
              Project Akhir Workshop
            </span>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Checking Backend...
              </span>
            ) : backendData ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Backend Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                Backend Offline
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        {/* Animated Stack Logos */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8">
          {/* Laravel Logo */}
          <div className="group relative p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-xl group-hover:bg-red-500/20 transition-all"></div>
            <svg className="w-14 h-14 relative z-10 text-red-500 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <span className="text-2xl font-light text-slate-600">+</span>

          {/* React Logo */}
          <div className="group relative p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
            <img
              src={reactLogo}
              className="w-14 h-14 relative z-10 drop-shadow-md animate-[spin_25s_linear_infinite]"
              alt="React logo"
            />
          </div>

          <span className="text-2xl font-light text-slate-600">+</span>

          {/* Tailwind CSS Logo */}
          <div className="group relative p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-sky-500/10 rounded-2xl blur-xl group-hover:bg-sky-500/20 transition-all"></div>
            <svg
              className="w-14 h-14 relative z-10 text-sky-400 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-red-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
            Laravel + React + Tailwind CSS
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Fullstack communication established between Laravel API backend and React Vite frontend.
        </p>

        {/* Connection Live Status Card */}
        <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8 text-left backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">API Connection Status</span>
              {lastChecked && (
                <span className="text-xs text-slate-500">Checked at {lastChecked}</span>
              )}
            </div>

            <button
              type="button"
              onClick={testBackendConnection}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95 disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to <code className="text-cyan-400 font-mono">http://localhost:8000/api/status</code>...</span>
            </div>
          ) : backendData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{backendData.message}</span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Laravel Version</span>
                  <span className="font-mono text-xs text-red-400 font-semibold">{backendData.laravel_version}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">PHP Version</span>
                  <span className="font-mono text-xs text-sky-400 font-semibold">{backendData.php_version}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">Environment</span>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{backendData.environment}</span>
                </div>
              </div>

              {/* Raw JSON Response preview */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1.5 font-medium">Server Response Payload:</span>
                <pre className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {JSON.stringify(backendData, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold block mb-0.5">Could not reach backend API</span>
                  <span>{error || 'Make sure the Laravel development server is running on port 8000.'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-2">
                <span className="font-medium text-slate-200 block">How to start Laravel Backend:</span>
                <p>Open a terminal, go to the <code className="text-amber-300">backend</code> folder, and run:</p>
                <div className="p-2.5 rounded-lg bg-black/60 font-mono text-emerald-400 border border-slate-800">
                  php artisan serve
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Once started, click <strong className="text-slate-300">Test Connection</strong> above to verify.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links Section */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Laravel API Endpoints</h3>
            <p className="text-xs text-slate-400 mb-2">Registered in <code className="text-cyan-400">backend/routes/api.php</code></p>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">GET /api/status</div>
              <div className="text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">GET /api/health</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Frontend API Client</h3>
            <p className="text-xs text-slate-400 mb-2">Configured in <code className="text-cyan-400">src/services/api.js</code></p>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">import &#123; apiRequest &#125;</div>
              <div className="text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">checkBackendStatus()</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>Project Akhir Workshop Teknologi Web dan Aplikasi &copy; 2026</p>
      </footer>
    </div>
  )
}

export default App
