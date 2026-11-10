import React, { useState, useEffect } from 'react';
import {
  Trash2,
  FolderTree,
  Users2,
  ReceiptText,
  DollarSign,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Printer,
  Plus,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import ReceiptModal from '../components/ReceiptModal';
import { formatRupiah, formatWeight, formatDateTime, formatDate } from '../utils/formatters';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState(null);
  const [selectedTrxForReceipt, setSelectedTrxForReceipt] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getDashboard(period);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  if (loading && !data) {
    return <Loading message="Memuat analitik dan statistik dashboard..." />;
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};
  const recentTransactions = data?.recent_transactions || [];
  const topCustomers = data?.top_customers || [];
  const activities = data?.activities || [];

  // Line Chart: Collection Trends
  const trendLineData = {
    labels: charts.trends?.labels || [],
    datasets: [
      {
        label: 'Bobot Sampah (kg)',
        data: charts.trends?.weights || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10B981',
        pointRadius: 4,
      },
    ],
  };

  // Bar Chart: Transaction Values
  const transactionBarData = {
    labels: charts.trends?.labels || [],
    datasets: [
      {
        label: 'Nilai Transaksi (Rp)',
        data: charts.trends?.amounts || [],
        backgroundColor: '#059669',
        borderRadius: 8,
      },
    ],
  };

  // Doughnut Chart: Categories Distribution
  const categoryLabels = (charts.categories || []).map((c) => c.name);
  const categoryWeights = (charts.categories || []).map((c) => c.weight);
  const categoryColors = (charts.categories || []).map((c) => c.color || '#10B981');

  const categoryDoughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryWeights.length > 0 ? categoryWeights : [1],
        backgroundColor: categoryColors.length > 0 ? categoryColors : ['#E2E8F0'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Horizontal Bar Chart: Top Waste Types
  const topWasteLabels = (charts.waste_types || []).map((w) => w.name);
  const topWasteWeights = (charts.waste_types || []).map((w) => w.weight);

  const topWasteBarData = {
    labels: topWasteLabels,
    datasets: [
      {
        label: 'Bobot Terkumpul (kg)',
        data: topWasteWeights,
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Ringkasan Pengelolaan & Daur Ulang
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data operasional bank sampah terintegrasi secara realtime dari repositori Laravel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Period Filter */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'daily' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'weekly' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'monthly' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Bulanan
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Muat ulang data"
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Sampah"
          value={formatWeight(metrics.total_waste_kg)}
          icon={Trash2}
          color="emerald"
          subtitle="Terkumpul di sistem"
        />
        <StatCard
          title="Nilai Transaksi"
          value={formatRupiah(metrics.total_transaction_value)}
          icon={DollarSign}
          color="blue"
          subtitle="Disalurkan ke nasabah"
        />
        <StatCard
          title="Total Transaksi"
          value={metrics.total_transactions || 0}
          icon={ReceiptText}
          color="amber"
          subtitle="Setoran tercatat"
        />
        <StatCard
          title="Mitra / Nasabah"
          value={metrics.total_customers || 0}
          icon={Users2}
          color="purple"
          subtitle="Nasabah terdaftar"
        />
        <StatCard
          title="Kategori Sampah"
          value={metrics.total_categories || 0}
          icon={FolderTree}
          color="emerald"
          subtitle="Kategori aktif"
        />
        <StatCard
          title="Setoran Hari Ini"
          value={formatWeight(metrics.waste_collected_today_kg)}
          icon={Clock}
          color="blue"
          subtitle="Tercatat hari ini"
        />
      </div>

      {/* Chart Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Tren Pengumpulan Sampah</h3>
              <p className="text-xs text-slate-400">Total berat sampah masuk ({period})</p>
            </div>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64">
            <Line
              data={trendLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (val) => `${val} kg`,
                    },
                    grid: { color: '#F1F5F9' },
                  },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Categories Distribution (Doughnut) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Distribusi Kategori Sampah</h3>
              <p className="text-xs text-slate-400">Proporsi timbulan berdasarkan material</p>
            </div>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <FolderTree className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={categoryDoughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { boxWidth: 12, font: { size: 11 } },
                  },
                },
                cutout: '68%',
              }}
            />
          </div>
        </div>

        {/* Transaction Value Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Statistik Nilai Penyetoran</h3>
              <p className="text-xs text-slate-400">Perputaran nilai ekonomi sampah ({period})</p>
            </div>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64">
            <Bar
              data={transactionBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (val) => `Rp ${val / 1000}k`,
                    },
                    grid: { color: '#F1F5F9' },
                  },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Top Waste Types Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Jenis Sampah Paling Banyak</h3>
              <p className="text-xs text-slate-400">Peringkat akumulasi volume tertinggi</p>
            </div>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Trash2 className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64">
            <Bar
              data={topWasteBarData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      callback: (val) => `${val} kg`,
                    },
                    grid: { color: '#F1F5F9' },
                  },
                  y: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Tables & Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Transaksi Penyetoran Terakhir</h3>
              <p className="text-xs text-slate-400">Aktivitas penimbangan dan transaksi terbaru</p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/70 text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">ID Transaksi</th>
                  <th className="px-5 py-3">Nasabah</th>
                  <th className="px-5 py-3">Berat Total</th>
                  <th className="px-5 py-3">Nilai Total</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-semibold text-slate-800 text-xs">
                        {trx.id}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {formatDateTime(trx.date || trx.created_at)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {trx.customer_name}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {formatWeight(trx.total_weight)}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-700">
                      {formatRupiah(trx.total_amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedTrxForReceipt(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Contributing Customers (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Nasabah Teraktif</h3>
              <p className="text-xs text-slate-400">Peringkat kontribusi tertinggi</p>
            </div>
            <Link
              to="/customers"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {topCustomers.map((cust, idx) => (
              <div
                key={cust.id}
                onClick={() => navigate(`/customers?id=${cust.id}`)}
                className="p-3 rounded-xl bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-100 transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800 truncate max-w-[130px]">
                      {cust.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{cust.trx_count} transaksi</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-emerald-700 block">
                    {formatRupiah(cust.total_amount)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatWeight(cust.total_weight)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => navigate('/transactions?create=true')}
            className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Input Setoran Baru Sekarang</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedTrxForReceipt && (
        <ReceiptModal
          isOpen={!!selectedTrxForReceipt}
          onClose={() => setSelectedTrxForReceipt(null)}
          transaction={selectedTrxForReceipt}
        />
      )}
    </div>
  );
}

