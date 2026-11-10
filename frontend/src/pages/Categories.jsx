import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2,
  Trash2,
  PackageCheck,
} from 'lucide-react';
import { categoryAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRupiah } from '../utils/formatters';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#10B981',
  });

  const { isAdmin } = useAuth();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#10B981',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || '#10B981',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = async (cat) => {
    try {
      const res = await categoryAPI.getById(cat.id);
      if (res.success && res.data) {
        setSelectedCategory(res.data);
        setIsDetailModalOpen(true);
      }
    } catch {
      setSelectedCategory(cat);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenDeleteModal = (cat) => {
    setSelectedCategory(cat);
    setErrorMessage('');
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Nama kategori material wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedCategory) {
        await categoryAPI.update(selectedCategory.id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      setIsFormModalOpen(false);
      loadCategories();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      const res = await categoryAPI.delete(selectedCategory.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
        loadCategories();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || 'Gagal menghapus kategori.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'ID & Nama Kategori',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: `${row.color || '#10B981'}20`,
              color: row.color || '#10B981',
            }}
          >
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <span className="text-[11px] font-mono text-slate-400">{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Deskripsi Kategori',
      accessor: 'description',
      render: (row) => (
        <span className="text-xs text-slate-500 max-w-sm line-clamp-1">
          {row.description || '-'}
        </span>
      ),
    },
    {
      header: 'Jumlah Jenis Sampah',
      accessor: 'waste_count',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{row.waste_count || 0} Jenis</span>
        </span>
      ),
    },
    {
      header: 'Tanggal Dibuat',
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
            title="Lihat Detail & Jenis Sampah Terkait"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleOpenEditModal(row)}
                title="Edit Kategori"
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenDeleteModal(row)}
                title="Hapus Kategori"
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Kategori Sampah Daur Ulang</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelompokan material sampah utama (Plastik, Kertas, Logam, Kaca, Organik, Minyak Jelantah).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
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
              <span>Tambah Kategori</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      {loading && categories.length === 0 ? (
        <Loading message="Memuat daftar kategori..." />
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          searchPlaceholder="Cari kategori material atau deskripsi..."
          searchKeys={['id', 'name', 'description']}
        />
      )}

      {/* Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedCategory ? 'Perbarui Kategori Sampah' : 'Tambah Kategori Sampah Baru'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Kategori Material *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Plastik & Polimer"
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Warna Label / Tag</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 p-1 rounded-xl border border-slate-200 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600 uppercase">{formData.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kategori</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Penjelasan jenis material dan cakupan sampah yang tergolong dalam kategori ini..."
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
              <span>{selectedCategory ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal with Linked Waste Types */}
      {selectedCategory && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Detail Kategori: ${selectedCategory.name}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 block">{selectedCategory.id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedCategory.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedCategory.description}</p>
              </div>
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                style={{ backgroundColor: selectedCategory.color || '#10B981' }}
              >
                <FolderTree className="w-5 h-5" />
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Daftar Jenis Sampah Terkait ({selectedCategory.waste_items?.length || 0})
              </h4>

              {selectedCategory.waste_items && selectedCategory.waste_items.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedCategory.waste_items.map((waste) => (
                    <div
                      key={waste.id}
                      className="p-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-xs text-slate-800 block">
                          {waste.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{waste.id}</span>
                      </div>
                      <span className="font-bold text-emerald-700 text-xs">
                        {formatRupiah(waste.price_per_kg)} / kg
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                  Belum ada jenis sampah yang dihubungkan ke kategori ini.
                </p>
              )}
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
        title="Hapus Kategori Sampah"
        message={
          selectedCategory?.waste_count > 0
            ? `Peringatan: Kategori "${selectedCategory?.name}" saat ini masih memiliki ${selectedCategory?.waste_count} jenis sampah terkait. Sistem akan memblokir penghapusan demi menjaga integritas data!`
            : `Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.name}"?`
        }
        confirmText="Hapus Kategori"
      />
    </div>
  );
}

