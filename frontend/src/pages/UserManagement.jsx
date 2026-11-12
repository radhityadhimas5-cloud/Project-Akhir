import React, { useState, useEffect } from 'react';
import {
  UserCog,
  Plus,
  Edit2,
  Trash,
  Search,
  Eye,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { userAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    status: 'active',
    phone: '',
  });

  const { user: currentAuthUser } = useAuth();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll({
        role: roleFilter,
        status: statusFilter,
      });
      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Staff',
      status: 'active',
      phone: '',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setSelectedUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '', // Blank means keep existing password
      role: u.role,
      status: u.status || 'active',
      phone: u.phone || '',
    });
    setErrorMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (u) => {
    setSelectedUser(u);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Alamat email wajib diisi.');
      return;
    }
    if (!selectedUser && !formData.password.trim()) {
      setErrorMessage('Kata sandi awal wajib diisi untuk akun baru.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedUser) {
        await userAPI.update(selectedUser.id, formData);
      } else {
        await userAPI.create(formData);
      }
      setIsFormModalOpen(false);
      loadUsers();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan data pengguna.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const res = await userAPI.delete(selectedUser.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || 'Gagal menghapus pengguna.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Pengguna',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            }
            alt={row.name}
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div>
            <span className="font-semibold text-slate-900 block">{row.name}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-mono">{row.id}</span>
              {row.id === currentAuthUser?.id && (
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                  (Anda)
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Alamat Email & Kontak',
      accessor: 'email',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-medium text-slate-700">{row.email}</div>
          <div className="text-slate-400">{row.phone || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Peran (Role)',
      accessor: 'role',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.role === 'Administrator'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {row.role === 'Administrator' ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
          <span>{row.role}</span>
        </span>
      ),
    },
    {
      header: 'Status Akun',
      accessor: 'status',
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.status === 'active'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {row.status === 'active' ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          <span className="capitalize">{row.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
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
            onClick={() => handleOpenEditModal(row)}
            title="Edit Pengguna"
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {row.id !== currentAuthUser?.id && (
            <button
              onClick={() => handleOpenDeleteModal(row)}
              title="Hapus Pengguna"
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna & Otorisasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hak akses Administrator (penuh) dan Staff Operator Kasir penimbangan sampah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
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
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading && users.length === 0 ? (
        <Loading message="Memuat data pengguna..." />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Cari nama, email, atau peran..."
          searchKeys={['id', 'name', 'email', 'role']}
          filterComponent={
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Semua Peran</option>
                <option value="Administrator">Administrator</option>
                <option value="Staff">Staff</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          }
        />
      )}

      {/* Form Modal (Add / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedUser ? 'Perbarui Data Pengguna' : 'Tambah Pengguna Baru'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Rian Anggara"
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rian@sampahpay.com"
              required
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi {selectedUser ? '(Kosongkan jika tidak ingin mengubah)' : '*'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={selectedUser ? '••••••••' : 'Minimal 6 karakter'}
              required={!selectedUser}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peran (Role) *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Staff">Staff (Operator & Kasir)</option>
                <option value="Administrator">Administrator (Akses Penuh)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Akun *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">No. Handphone / WhatsApp</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0812-3456-7890"
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
              <span>{selectedUser ? 'Simpan Perubahan' : 'Buat Akun'}</span>
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
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun pengguna "${selectedUser?.name}" (${selectedUser?.email})?`}
        confirmText="Hapus Pengguna"
      />
    </div>
  );
}

