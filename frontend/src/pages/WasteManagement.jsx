import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Edit2,
  Trash,
  Search,
  Filter,
  Eye,
  Tag,
  AlertCircle,
  Loader2,
  RefreshCw,
  FolderTree,
} from 'lucide-react';
import { wasteAPI, categoryAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function WasteManagement() {
  const [wasteList, setWasteList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price_per_kg: '',
    description: '',
    unit: 'kg',
  });

  const { isAdmin } = useAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const [wasteRes, catRes] = await Promise.all([
        wasteAPI.getAll({ category_id: selectedCategoryFilter }),
        categoryAPI.getAll(),
      ]);
      if (wasteRes.success) setWasteList(wasteRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error('Error fetching waste data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategoryFilter]);

  const handleOpenCreateModal = () => {
    setSelectedWaste(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      price_per_kg: '',
      description: '',
      unit: 'kg',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (waste) => {
    setSelectedWaste(waste);
    setFormData({
      name: waste.name,
      category_id: waste.category_id,
      price_per_kg: waste.price_per_kg,
      description: waste.description || '',
      unit: waste.unit || 'kg',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (waste) => {
    setSelectedWaste(waste);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (waste) => {
    setSelectedWaste(waste);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Nama jenis sampah wajib diisi.');
      return;
    }
    if (!formData.category_id) {
      setErrorMessage('Pilih kategori sampah yang sesuai.');
      return;
    }
    if (formData.price_per_kg === '' || Number(formData.price_per_kg) < 0) {
      setErrorMessage('Harga beli per kg harus berupa angka positif.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedWaste) {
        // Update existing
        await wasteAPI.update(selectedWaste.id, formData);
      } else {
        // Create new
        await wasteAPI.create(formData);
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan data jenis sampah.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedWaste) return;
    setSubmitting(true);
    try {
      await wasteAPI.delete(selectedWaste.id);
      setIsDeleteModalOpen(false);
      setSelectedWaste(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Gagal menghapus jenis sampah.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'ID & Nama Sampah',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] font-mono text-slate-400">{row.id}</span>
        </div>
      ),
    },
    {
      header: 'Kategori',
      accessor: 'category_name',
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${row.category_color}18`,
            color: row.category_color,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: row.category_color }}
          />
          {row.category_name}
        </span>
      ),
    },
    {
      header: 'Harga Beli (per kg)',
      accessor: 'price_per_kg',
      render: (row) => (
        <span className="font-bold text-emerald-700 text-sm">
          {formatRupiah(row.price_per_kg)}
        </span>
      ),
    },
    {
      header: 'Deskripsi & Syarat',
      accessor: 'description',
      render: (row) => (
        <span className="text-xs text-slate-500 line-clamp-1 max-w-xs">
          {row.description || '-'}
        </span>
      ),
    },
    {
      header: 'Terdaftar',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-xs text-slate-500">{formatDate(row.created_at)}</span>
      ),
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenDetailModal(row)}
            title="Lihat Detail"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleOpenEditModal(row)}
                title="Edit Data"
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenDeleteModal(row)}
                title="Hapus Data"
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <Trash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Katalog Jenis Sampah</h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar jenis sampah daur ulang beserta acuan standar harga beli per kilogram (Rp/kg).
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

          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jenis Sampah</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table with Category Filter */}
      {loading && wasteList.length === 0 ? (
        <Loading message="Memuat daftar jenis sampah..." />
      ) : (
        <DataTable
          columns={columns}
          data={wasteList}
          searchPlaceholder="Cari nama sampah, kode, atau deskripsi..."
          searchKeys={['id', 'name', 'category_name', 'description']}
          filterComponent={
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      )}

      {/* Add / Edit Waste Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedWaste ? 'Perbarui Data Jenis Sampah' : 'Tambah Jenis Sampah Baru'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Jenis Sampah *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Botol Plastik PET Bening"
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Material *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Beli per Kilogram (Rp) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.price_per_kg}
                onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                placeholder="4500"
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi / Kondisi Penerimaan</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Spesifikasi kondisi sampah yang diterima, misalnya: bersih, tanpa label, dipres padat..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{selectedWaste ? 'Simpan Perubahan' : 'Tambahkan Sampah'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Waste Modal */}
      {selectedWaste && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Detail Jenis Sampah"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">{selectedWaste.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedWaste.name}</h3>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${selectedWaste.category_color}20`,
                  color: selectedWaste.category_color,
                }}
              >
                {selectedWaste.category_name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-800 block">Harga Beli Standar</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">
                  {formatRupiah(selectedWaste.price_per_kg)} / kg
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Satuan Timbangan</span>
                <span className="text-lg font-bold text-slate-800 font-mono">
                  Kilogram (kg)
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">
                Kondisi & Deskripsi Penerimaan
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedWaste.description || 'Tidak ada deskripsi khusus.'}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
              <span>Waktu Pembuatan: {formatDate(selectedWaste.created_at)}</span>
              <span>Pembaruan: {formatDate(selectedWaste.updated_at)}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={submitting}
        title="Hapus Jenis Sampah"
        message={`Apakah Anda yakin ingin menghapus "${selectedWaste?.name}" dari katalog sampah?`}
        confirmText="Hapus Permanen"
      />
    </div>
  );
}

