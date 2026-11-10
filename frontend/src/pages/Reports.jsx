import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Printer,
  Download,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  Trash2,
  DollarSign,
  ReceiptText,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { reportAPI, categoryAPI, wasteAPI } from '../services/api';
import Loading from '../components/Loading';
import StatCard from '../components/StatCard';
import { formatRupiah, formatWeight, formatDate, formatDateTime } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
  const [reportType, setReportType] = useState('collection'); // 'collection', 'transactions', 'categories', 'waste_types', 'customers'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWaste, setSelectedWaste] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load filter options
  useEffect(() => {
    async function loadOptions() {
      try {
        const [catRes, wasteRes] = await Promise.all([
          categoryAPI.getAll(),
          wasteAPI.getAll(),
        ]);
        if (catRes.success) setCategories(catRes.data || []);
        if (wasteRes.success) setWasteItems(wasteRes.data || []);
      } catch (err) {
        console.error('Error loading report options:', err);
      }
    }
    loadOptions();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportAPI.getReport({
        type: reportType,
        start_date: startDate,
        end_date: endDate,
        category_id: selectedCategory,
        waste_id: selectedWaste,
        search: searchTerm,
      });
      if (res.success && res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate, selectedCategory, selectedWaste]);

  const handlePrint = () => {
    window.print();
  };

  const summary = reportData?.summary || {};
  const lineItems = reportData?.line_items || [];
  const byCategory = reportData?.by_category || [];
  const byWaste = reportData?.by_waste || [];
  const byCustomer = reportData?.by_customer || [];

  // Chart data according to active report tab
  const getChartData = () => {
    if (reportType === 'categories') {
      return {
        labels: byCategory.map((c) => c.category),
        datasets: [
          {
            label: 'Total Berat (kg)',
            data: byCategory.map((c) => c.total_weight),
            backgroundColor: '#10B981',
            borderRadius: 6,
          },
        ],
      };
    }
    if (reportType === 'waste_types') {
      return {
        labels: byWaste.slice(0, 8).map((w) => w.waste_name),
        datasets: [
          {
            label: 'Total Berat (kg)',
            data: byWaste.slice(0, 8).map((w) => w.total_weight),
            backgroundColor: '#3B82F6',
            borderRadius: 6,
          },
        ],
      };
    }
    if (reportType === 'customers') {
      return {
        labels: byCustomer.slice(0, 8).map((c) => c.customer_name),
        datasets: [
          {
            label: 'Nilai Transaksi (Rp)',
            data: byCustomer.slice(0, 8).map((c) => c.total_amount),
            backgroundColor: '#8B5CF6',
            borderRadius: 6,
          },
        ],
      };
    }
    // Default Collection
    return {
      labels: byCategory.map((c) => c.category),
      datasets: [
        {
          label: 'Total Sampah Masuk (kg)',
          data: byCategory.map((c) => c.total_weight),
          backgroundColor: '#059669',
          borderRadius: 6,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Print Action */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Laporan & Rekapitulasi Analitik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ekstraksi komprehensif data volume sampah, sirkulasi dana nasabah, dan performa kategori material.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            title="Muat Ulang Laporan"
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Report Tabs (No Print) */}
      <div className="no-print flex overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80">
        {[
          { key: 'collection', label: '1. Pengumpulan Sampah' },
          { key: 'transactions', label: '2. Transaksi Rinci' },
          { key: 'categories', label: '3. Per Kategori' },
          { key: 'waste_types', label: '4. Per Jenis Sampah' },
          { key: 'customers', label: '5. Aktivitas Nasabah' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              reportType === tab.key
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Controls (No Print) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400 hidden sm:block" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Tanggal Mulai"
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          />
          <span className="text-xs text-slate-400">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="Tanggal Akhir"
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Waste Filter */}
        <select
          value={selectedWaste}
          onChange={(e) => setSelectedWaste(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Semua Jenis Sampah</option>
          {wasteItems.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {(startDate || endDate || selectedCategory !== 'all' || selectedWaste !== 'all') && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setSelectedCategory('all');
              setSelectedWaste('all');
            }}
            className="text-xs text-emerald-600 font-semibold hover:underline ml-auto"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Printable Area Wrapper */}
      <div className="printable-area space-y-6">
        {/* Printable Official Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <h2 className="text-xl font-bold font-sans text-slate-900 uppercase tracking-tight">
            MALLSAMPAH RECYCLING NETWORK
          </h2>
          <p className="text-xs text-slate-600">
            LAPORAN RESMI REKAPITULASI PENGELOLAAN BANK SAMPAH & DAUR ULANG
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Dicetak pada: {formatDateTime(new Date())} • Mode: Backend Temporary In-Memory System
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Berat Sampah"
            value={formatWeight(summary.total_weight_kg || 0)}
            icon={Trash2}
            color="emerald"
            subtitle="Volume bersih masuk"
          />
          <StatCard
            title="Total Nilai Transaksi"
            value={formatRupiah(summary.total_amount_idr || 0)}
            icon={DollarSign}
            color="blue"
            subtitle="Dana tabungan nasabah"
          />
          <StatCard
            title="Jumlah Transaksi"
            value={`${summary.total_transactions || 0} Setoran`}
            icon={ReceiptText}
            color="amber"
            subtitle="Frekuensi penerimaan"
          />
          <StatCard
            title="Total Rincian Baris"
            value={`${summary.total_records || 0} Baris`}
            icon={Layers}
            color="purple"
            subtitle="Item sampah terklasifikasi"
          />
        </div>

        {/* Visual Chart Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="font-semibold text-slate-900 text-sm mb-4">
            Grafik Visualisasi: {reportType.toUpperCase()}
          </h3>
          <div className="h-64">
            <Bar
              data={getChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#F1F5F9' } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">
              Tabel Rekapitulasi Rinci ({reportType.toUpperCase()})
            </h3>
            <span className="text-xs text-slate-400">
              Total {lineItems.length} baris data ditemukan
            </span>
          </div>

          <div className="overflow-x-auto">
            {reportType === 'categories' ? (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Kategori Material</th>
                    <th className="px-5 py-3">Jumlah Item Sampah</th>
                    <th className="px-5 py-3 text-right">Total Berat (kg)</th>
                    <th className="px-5 py-3 text-right">Total Nilai (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byCategory.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-900">{cat.category}</td>
                      <td className="px-5 py-3">{cat.item_count} entri</td>
                      <td className="px-5 py-3 text-right font-mono font-bold">
                        {formatWeight(cat.total_weight)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                        {formatRupiah(cat.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : reportType === 'waste_types' ? (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Nama Jenis Sampah</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3">Frekuensi</th>
                    <th className="px-5 py-3 text-right">Total Berat (kg)</th>
                    <th className="px-5 py-3 text-right">Total Nilai (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byWaste.map((w, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-900">{w.waste_name}</td>
                      <td className="px-5 py-3 text-slate-500">{w.category_name}</td>
                      <td className="px-5 py-3">{w.count} kali</td>
                      <td className="px-5 py-3 text-right font-mono font-bold">
                        {formatWeight(w.total_weight)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                        {formatRupiah(w.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : reportType === 'customers' ? (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Nama Nasabah / Mitra</th>
                    <th className="px-5 py-3">Jumlah Penyetoran</th>
                    <th className="px-5 py-3 text-right">Total Sampah (kg)</th>
                    <th className="px-5 py-3 text-right">Total Nilai Tabungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byCustomer.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {cust.customer_name}
                      </td>
                      <td className="px-5 py-3">{cust.transaction_count} transaksi</td>
                      <td className="px-5 py-3 text-right font-mono font-bold">
                        {formatWeight(cust.total_weight)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                        {formatRupiah(cust.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">ID Transaksi & Tanggal</th>
                    <th className="px-5 py-3">Nasabah</th>
                    <th className="px-5 py-3">Jenis Sampah</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3 text-right">Berat (kg)</th>
                    <th className="px-5 py-3 text-right">Harga / kg</th>
                    <th className="px-5 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-slate-800 block">
                          {item.transaction_id}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(item.date)}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {item.customer_name}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {item.waste_name}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{item.category_name}</td>
                      <td className="px-5 py-3 text-right font-mono">{formatWeight(item.weight)}</td>
                      <td className="px-5 py-3 text-right font-mono text-slate-500">
                        {formatRupiah(item.price_per_kg)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                        {formatRupiah(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

