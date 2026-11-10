import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Phone,
  Mail,
  MapPin,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Database,
  Info,
  Shield,
  FileText,
} from 'lucide-react';
import { settingAPI } from '../services/api';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { user } = useAuth();

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await settingAPI.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await settingAPI.updateSettings(settings);
      if (res.success) {
        setSuccessMsg('Pengaturan sistem dan organisasi berhasil disimpan!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      const res = await settingAPI.resetData();
      if (res.success) {
        setIsResetModalOpen(false);
        setSuccessMsg('Data sementara telah berhasil direset ke data sampel awal pabrik!');
        loadSettings();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Gagal mereset data.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <Loading message="Memuat konfigurasi sistem..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi identitas organisasi bank sampah, cetakan struk, dan manajemen repositori.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Identitas Organisasi & Kontak</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Organisasi / Bank Sampah
              </label>
              <input
                type="text"
                value={settings.org_name || ''}
                onChange={(e) => setSettings({ ...settings, org_name: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Resmi Organisasi
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Hotline / Telepon
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Kantor Pusat / Gudang Penerimaan
            </label>
            <textarea
              rows="2"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Receipt Customization Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Format & Teks Struk Cetak</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Header Struk
              </label>
              <input
                type="text"
                value={settings.receipt_header || ''}
                onChange={(e) => setSettings({ ...settings, receipt_header: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Simbol Mata Uang
              </label>
              <input
                type="text"
                value={settings.currency_symbol || 'Rp'}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pesan Footer Struk (Penutup)
            </label>
            <input
              type="text"
              value={settings.receipt_footer || ''}
              onChange={(e) => setSettings({ ...settings, receipt_footer: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Database-Free Architecture Explanation Card */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-3 text-xs text-amber-900">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <Database className="w-4 h-4 text-amber-600" />
          <span>Status Arsitektur Repositori: Bebas Database (Database-Free)</span>
        </div>
        <p className="leading-relaxed">
          Sesuai spesifikasi proyek, sistem saat ini mengoperasikan <strong>BaseTemporaryRepository</strong> di backend Laravel tanpa database SQL (tanpa MySQL/MariaDB/SQLite). Seluruh data transaksi, pelanggan, jenis sampah, dan pengguna dikelola dalam memori backend dan tersimpan sementara pada penyimpanan internal Laravel.
        </p>
        <p className="leading-relaxed">
          Desain arsitektur menggunakan <em>Repository Pattern</em> & <em>Service Layer</em> sehingga di masa mendatang jika dibutuhkan integrasi database MySQL/PostgreSQL, repositori dapat langsung diganti tanpa perlu merombak antarmuka frontend maupun controller backend.
        </p>

        <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
          <span className="text-amber-800">
            Ingin mengembalikan data uji coba ke kondisi awal pabrik?
          </span>
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data ke Standar Awal</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        isLoading={resetting}
        title="Reset Data Sementara"
        message="Apakah Anda yakin ingin mereset seluruh data (kategori, jenis sampah, nasabah, transaksi) kembali ke data awal sampel pabrik? Seluruh penambahan data baru selama sesi ini akan dikembalikan."
        confirmText="Ya, Reset Data Sekarang"
        variant="warning"
      />
    </div>
  );
}

