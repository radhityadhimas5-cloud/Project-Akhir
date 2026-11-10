import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Edit2,
  Trash,
  Search,
  Eye,
  RefreshCw,
  Phone,
  MapPin,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  Building2,
  User,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { formatRupiah, formatWeight, formatDate } from '../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'Individual',
    status: 'active',
  });

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerAPI.getAll({ type: typeFilter });
      if (res.success) {
        setCustomers(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [typeFilter]);

  const handleOpenCreateModal = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      type: 'Individual',
      status: 'active',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setSelectedCustomer(cust);
    setFormData({
      name: cust.name,
      email: cust.email || '',
      phone: cust.phone || '',
      address: cust.address || '',
      type: cust.type || 'Individual',
      status: cust.status || 'active',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (cust) => {
    setSelectedCustomer(cust);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Nama lengkap nasabah wajib diisi.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Nomor telepon/WA wajib diisi.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Alamat domisili wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedCustomer) {
        await customerAPI.update(selectedCustomer.id, formData);
      } else {
        await customerAPI.create(formData);
      }
      setIsFormModalOpen(false);
      loadCustomers();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan data nasabah.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    setSubmitting(true);
    try {
      const res = await customerAPI.delete(selectedCustomer.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setSelectedCustomer(null);
        loadCustomers();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || 'Gagal menghapus data nasabah.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'ID & Nama Nasabah',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
              row.type?.includes('Business') || row.type?.includes('Corporate')
                ? 'bg-blue-50 text-blue-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {row.type?.includes('Business') ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block hover:text-emerald-700 cursor-pointer" onClick={() => navigate(`/customers/${row.id}`)}>
              {row.name}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-mono">{row.id}</span>
              <span>•</span>
              <span className="text-slate-500">{row.type}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Kontak & Alamat',
      accessor: 'phone',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-slate-700 flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{row.phone}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1.5 truncate max-w-xs">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{row.address}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Total Setoran',
      accessor: 'total_transactions',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 text-xs block">
            {row.total_transactions || 0} Transaksi
          </span>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold">
            {formatWeight(row.total_weight_kg || 0)}
          </span>
        </div>
      ),
    },
    {
      header: 'Nilai Ekonomi',
      accessor: 'total_value_idr',
      render: (row) => (
        <span className="font-bold text-emerald-700 text-sm">
          {formatRupiah(row.total_value_idr || 0)}
        </span>
      ),
    },
    {
      header: 'Terdaftar Sejak',
      accessor: 'registration_date',
      render: (row) => (
        <span className="text-xs text-slate-500">{formatDate(row.registration_date || row.created_at)}</span>
      ),
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/customers/${row.id}`)}
            title="Lihat Profil & Riwayat Lengkap"
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEditModal(row)}
            title="Edit Nasabah"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button
              onClick={() => handleOpenDeleteModal(row)}
              title="Hapus Nasabah"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manajemen Nasabah & Mitra</h2>
          <p className="text-xs text-slate-500 mt-1">
            Database nasabah perorangan, unit bank sampah binaan, restoran, dan mitra korporat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCustomers}
            title="Muat Ulang"
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Nasabah Baru</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading && customers.length === 0 ? (
        <Loading message="Memuat database nasabah..." />
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          searchPlaceholder="Cari nama, no HP, alamat, atau email nasabah..."
          searchKeys={['id', 'name', 'phone', 'address', 'email']}
          filterComponent={
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Semua Tipe Nasabah</option>
                <option value="Individual">Perorangan / Rumah Tangga</option>
                <option value="Business">Resto / Bisnis Kuliner</option>
                <option value="Corporate / Business">Korporat / Pabrik</option>
                <option value="Community Group">Komunitas / Bank Sampah RW</option>
              </select>
            </div>
          }
        />
      )}

      {/* Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedCustomer ? 'Perbarui Data Nasabah' : 'Pendaftaran Nasabah Baru'}
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
              Nama Lengkap / Instansi *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Ahmad Fauzi / PT Berkah Hijau"
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Telepon / WhatsApp *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812-3456-7890"
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipe Keanggotaan *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Individual">Perorangan (Individual)</option>
                <option value="Business">Resto / Bisnis UKM</option>
                <option value="Corporate / Business">Korporat / Industri</option>
                <option value="Community Group">Unit Bank Sampah / Komunitas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmad@gmail.com"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap / Lokasi Penjemputan *
            </label>
            <textarea
              rows="3"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota..."
              required
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
              <span>{selectedCustomer ? 'Simpan Perubahan' : 'Daftarkan Nasabah'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={submitting}
        title="Hapus Data Nasabah"
        message={`Apakah Anda yakin ingin menghapus data nasabah "${selectedCustomer?.name}"?`}
        confirmText="Hapus Nasabah"
      />
    </div>
  );
}

