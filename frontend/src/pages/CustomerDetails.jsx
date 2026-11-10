import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users2,
  Trash2,
  DollarSign,
  ReceiptText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  User,
  Printer,
  Plus,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { customerAPI } from '../services/api';
import Loading from '../components/Loading';
import StatCard from '../components/StatCard';
import ReceiptModal from '../components/ReceiptModal';
import { formatRupiah, formatWeight, formatDate, formatDateTime } from '../utils/formatters';

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const navigate = useNavigate();

  const loadCustomer = async () => {
    setLoading(true);
    try {
      const res = await customerAPI.getById(id);
      if (res.success && res.data) {
        setCustomer(res.data);
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id]);

  if (loading) {
    return <Loading message="Memuat detail profil nasabah & riwayat transaksi..." />;
  }

  if (!customer) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <h3 className="text-base font-bold text-slate-800">Nasabah Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Data nasabah dengan ID "{id}" tidak ditemukan dalam sistem.
        </p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Kembali ke Daftar Nasabah
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{customer.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {customer.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {customer.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCustomer}
            title="Muat Ulang"
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <button
            onClick={() => navigate(`/transactions?customer_id=${customer.id}&create=true`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Setor Sampah untuk Nasabah Ini</span>
          </button>
        </div>
      </div>

      {/* Customer Profile & Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Informasi Profil & Kontak
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{customer.email}</span>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{customer.address}</span>
            </div>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 text-slate-400">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Bergabung: {formatDate(customer.registration_date || customer.created_at)}</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Sampah Disetor"
            value={formatWeight(customer.total_weight_kg || 0)}
            icon={Trash2}
            color="emerald"
            subtitle="Akumulasi bersih"
          />
          <StatCard
            title="Nilai Ekonomi Diterima"
            value={formatRupiah(customer.total_value_idr || 0)}
            icon={DollarSign}
            color="blue"
            subtitle="Pencairan tabungan"
          />
          <StatCard
            title="Frekuensi Transaksi"
            value={`${customer.total_transactions || 0} Kali`}
            icon={ReceiptText}
            color="amber"
            subtitle="Riwayat penyetoran"
          />
        </div>
      </div>

      {/* Waste Breakdown Summary */}
      {customer.waste_breakdown && customer.waste_breakdown.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Komposisi Jenis Sampah yang Pernah Disetor
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {customer.waste_breakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800 block truncate max-w-[130px]">
                    {item.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatWeight(item.weight)}
                  </span>
                </div>
                <span className="font-bold text-emerald-700">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Riwayat Transaksi Penyetoran</h3>
            <p className="text-xs text-slate-400">Semua setoran yang tercatat untuk nasabah ini</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/70 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">ID & Waktu</th>
                <th className="px-5 py-3">Rincian Item Sampah</th>
                <th className="px-5 py-3">Petugas</th>
                <th className="px-5 py-3">Total Berat</th>
                <th className="px-5 py-3">Total Rupiah</th>
                <th className="px-5 py-3 text-right">Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customer.transactions && customer.transactions.length > 0 ? (
                customer.transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-semibold text-slate-800 text-xs block">
                        {trx.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDateTime(trx.date || trx.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-1 text-xs">
                        {trx.items &&
                          trx.items.map((it, itIdx) => (
                            <div key={itIdx} className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{it.waste_name}:</span>
                              <span className="font-mono text-slate-500">
                                {formatWeight(it.weight)} @ {formatRupiah(it.price_per_kg)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">
                      {trx.staff_name || 'Petugas'}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {formatWeight(trx.total_weight)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700 text-sm">
                      {formatRupiah(trx.total_amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedReceipt(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400">
                    Belum ada riwayat transaksi penyetoran untuk nasabah ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          transaction={selectedReceipt}
        />
      )}
    </div>
  );
}

