import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ReceiptText,
  Plus,
  Trash,
  Printer,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Calendar,
  AlertCircle,
  Loader2,
  Trash2,
  User,
  CheckCircle2,
  Receipt,
  Scale,
} from 'lucide-react';
import { transactionAPI, customerAPI, wasteAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import ReceiptModal from '../components/ReceiptModal';
import { useAuth } from '../contexts/AuthContext';
import { formatRupiah, formatWeight, formatDateTime, formatDate } from '../utils/formatters';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [customerFilter, setCustomerFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [receiptTrx, setReceiptTrx] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // New Transaction Form State
  const [newTransaction, setNewTransaction] = useState({
    customer_id: '',
    items: [
      { waste_id: '', weight: '' },
    ],
    notes: '',
  });

  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const loadData = async () => {
    setLoading(true);
    try {
      const [trxRes, custRes, wasteRes] = await Promise.all([
        transactionAPI.getAll({
          customer_id: customerFilter,
          start_date: startDateFilter,
          end_date: endDateFilter,
        }),
        customerAPI.getAll(),
        wasteAPI.getAll(),
      ]);

      if (trxRes.success) setTransactions(trxRes.data || []);
      if (custRes.success) setCustomers(custRes.data || []);
      if (wasteRes.success) setWasteItems(wasteRes.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerFilter, startDateFilter, endDateFilter]);

  // Open modal if URL query param has ?create=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      const targetCustId = params.get('customer_id') || '';
      handleOpenCreateModal(targetCustId);
    }
  }, [location.search, customers, wasteItems]);

  const handleOpenCreateModal = (prefillCustomerId = '') => {
    setNewTransaction({
      customer_id: prefillCustomerId || (customers[0]?.id || ''),
      items: [
        { waste_id: wasteItems[0]?.id || '', weight: '' },
      ],
      notes: '',
    });
    setErrorMessage('');
    setIsCreateModalOpen(true);
  };

  const handleAddItemRow = () => {
    setNewTransaction((prev) => ({
      ...prev,
      items: [...prev.items, { waste_id: wasteItems[0]?.id || '', weight: '' }],
    }));
  };

  const handleRemoveItemRow = (index) => {
    if (newTransaction.items.length <= 1) return;
    setNewTransaction((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewTransaction((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return { ...prev, items: updatedItems };
    });
  };

  // Dynamic calculations for preview
  const wasteMap = {};
  wasteItems.forEach((w) => {
    wasteMap[w.id] = w;
  });

  const calculatedItems = newTransaction.items.map((item) => {
    const waste = wasteMap[item.waste_id];
    const price = waste ? (Number(waste.price_per_kg) || 0) : 0;
    const weight = Number(item.weight) || 0;
    const subtotal = weight * price;
    return {
      waste,
      price,
      weight,
      subtotal,
    };
  });

  const previewTotalWeight = calculatedItems.reduce((acc, curr) => acc + curr.weight, 0);
  const previewTotalAmount = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newTransaction.customer_id) {
      setErrorMessage('Pilih nasabah yang menyetor sampah.');
      return;
    }

    for (let i = 0; i < newTransaction.items.length; i++) {
      const item = newTransaction.items[i];
      if (!item.waste_id) {
        setErrorMessage(`Pilih jenis sampah pada baris ke-${i + 1}.`);
        return;
      }
      if (!item.weight || Number(item.weight) <= 0) {
        setErrorMessage(`Berat sampah pada baris ke-${i + 1} harus lebih besar dari 0 kg.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_id: newTransaction.customer_id,
        items: newTransaction.items.map((it) => ({
          waste_id: it.waste_id,
          weight: Number(it.weight),
        })),
        notes: newTransaction.notes,
        staff_id: user?.id,
        staff_name: user?.name,
      };

      const res = await transactionAPI.create(payload);
      if (res.success && res.data) {
        setIsCreateModalOpen(false);
        setReceiptTrx(res.data); // Automatically prompt receipt print!
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan transaksi penyetoran sampah.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrx) return;
    setSubmitting(true);
    try {
      await transactionAPI.delete(selectedTrx.id);
      setIsDeleteModalOpen(false);
      setSelectedTrx(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal membatalkan transaksi.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'ID & Tanggal',
      accessor: 'id',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-800 text-xs block">
            {row.id}
          </span>
          <span className="text-[11px] text-slate-400">
            {formatDateTime(row.date || row.created_at)}
          </span>
        </div>
      ),
    },
    {
      header: 'Nasabah / Penyetor',
      accessor: 'customer_name',
      render: (row) => (
        <span className="font-semibold text-slate-900 block">
          {row.customer_name}
        </span>
      ),
    },
    {
      header: 'Rincian Sampah',
      accessor: 'items',
      render: (row) => (
        <div className="space-y-0.5 text-xs max-w-xs">
          {row.items &&
            row.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-600 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="font-medium text-slate-800 truncate">{item.waste_name}</span>
                <span className="font-mono text-slate-400">({formatWeight(item.weight)})</span>
              </div>
            ))}
        </div>
      ),
    },
    {
      header: 'Berat Total',
      accessor: 'total_weight',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 text-sm">
          {formatWeight(row.total_weight)}
        </span>
      ),
    },
    {
      header: 'Total Nilai (IDR)',
      accessor: 'total_amount',
      render: (row) => (
        <span className="font-bold text-emerald-700 text-sm">
          {formatRupiah(row.total_amount)}
        </span>
      ),
    },
    {
      header: 'Petugas Kasir',
      accessor: 'staff_name',
      render: (row) => (
        <span className="text-xs text-slate-500">{row.staff_name || 'Petugas'}</span>
      ),
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setReceiptTrx(row)}
            title="Lihat / Cetak Struk Bukti"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Struk</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setSelectedTrx(row);
                setIsDeleteModalOpen(true);
              }}
              title="Batalkan / Hapus Transaksi"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Transaksi Penyetoran Sampah</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan penimbangan sampah, kalkulasi otomatis nilai rupiah, dan pencetakan struk bukti setor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            title="Muat Ulang"
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={() => handleOpenCreateModal()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Main Table with Filters */}
      {loading && transactions.length === 0 ? (
        <Loading message="Memuat riwayat transaksi..." />
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          searchPlaceholder="Cari ID transaksi, nasabah, petugas, atau catatan..."
          searchKeys={['id', 'customer_name', 'staff_name', 'notes']}
          filterComponent={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Semua Nasabah</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                title="Tanggal Mulai"
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              />
              <span className="text-xs text-slate-400">s/d</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                title="Tanggal Akhir"
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              />

              {(startDateFilter || endDateFilter) && (
                <button
                  onClick={() => {
                    setStartDateFilter('');
                    setEndDateFilter('');
                  }}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  Reset Tanggal
                </button>
              )}
            </div>
          }
        />
      )}

      {/* Create Transaction Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Form Penyetoran Sampah (Kalkulator Otomatis)"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Select Customer */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Nasabah / Penyetor *
            </label>
            <select
              value={newTransaction.customer_id}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, customer_id: e.target.value })
              }
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
            >
              <option value="">-- Pilih Nasabah Terdaftar --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type}) — {c.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Multiple Waste Type Rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Item Sampah & Hasil Penimbangan *
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris Sampah</span>
              </button>
            </div>

            <div className="space-y-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/70">
              {newTransaction.items.map((item, idx) => {
                const waste = wasteMap[item.waste_id];
                const price = waste ? Number(waste.price_per_kg) : 0;
                const weight = Number(item.weight) || 0;
                const subtotal = weight * price;

                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Item #{idx + 1}</span>
                      {newTransaction.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Waste Select (6 cols) */}
                      <div className="sm:col-span-6">
                        <select
                          value={item.waste_id}
                          onChange={(e) => handleItemChange(idx, 'waste_id', e.target.value)}
                          required
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                        >
                          <option value="">-- Pilih Jenis Sampah --</option>
                          {wasteItems.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} ({formatRupiah(w.price_per_kg)}/kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Weight Input (3 cols) */}
                      <div className="sm:col-span-3">
                        <div className="relative">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={item.weight}
                            onChange={(e) => handleItemChange(idx, 'weight', e.target.value)}
                            placeholder="Berat (kg)"
                            required
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-slate-900"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-semibold">
                            kg
                          </span>
                        </div>
                      </div>

                      {/* Subtotal Display (3 cols) */}
                      <div className="sm:col-span-3 text-right">
                        <span className="text-[10px] text-slate-400 block">Subtotal</span>
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          {formatRupiah(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction Summary Card */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-emerald-800 font-semibold block">
                Total Akumulasi Timbangan:
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {formatWeight(previewTotalWeight)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-800 font-semibold block">
                Total Nilai Diterima Nasabah:
              </span>
              <span className="text-xl font-bold text-emerald-700 font-mono">
                {formatRupiah(previewTotalAmount)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Penyetoran (Opsional)
            </label>
            <input
              type="text"
              value={newTransaction.notes}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, notes: e.target.value })
              }
              placeholder="Contoh: Sampah kondisi bersih, dipilah dari rumah..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan & Buat Struk</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={submitting}
        title="Batalkan Transaksi"
        message={`Apakah Anda yakin ingin membatalkan transaksi "${selectedTrx?.id}"?`}
        confirmText="Batalkan Transaksi"
      />

      {/* Printable Receipt Modal */}
      {receiptTrx && (
        <ReceiptModal
          isOpen={!!receiptTrx}
          onClose={() => setReceiptTrx(null)}
          transaction={receiptTrx}
        />
      )}
    </div>
  );
}

