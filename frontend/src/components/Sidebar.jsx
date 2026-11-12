import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Trash2,
  FolderTree,
  Users2,
  ReceiptText,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  Leaf,
  ChevronRight,
  ShieldAlert,
  Globe2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      to: '/transactions',
      label: 'Transaksi Penyetoran',
      icon: ReceiptText,
      adminOnly: false,
      badge: 'Utama',
    },
    {
      to: '/waste',
      label: 'Data Jenis Sampah',
      icon: Trash2,
      adminOnly: false,
    },
    {
      to: '/categories',
      label: 'Kategori Sampah',
      icon: FolderTree,
      adminOnly: false,
    },
    {
      to: '/customers',
      label: 'Nasabah / Mitra',
      icon: Users2,
      adminOnly: false,
    },
    {
      to: '/reports',
      label: 'Laporan & Analitik',
      icon: BarChart3,
      adminOnly: false,
    },
    {
      to: '/users',
      label: 'Manajemen Pengguna',
      icon: UserCog,
      adminOnly: true,
    },
    {
      to: '/settings',
      label: 'Pengaturan Sistem',
      icon: Settings,
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100 bg-white">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              SampahPay
            </h1>
            <p className="text-[11px] font-medium text-emerald-600">Waste Bank Admin</p>
          </div>
        </div>

        {/* Database-Free Notice Badge */}
        <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-100/60 flex items-center gap-2 text-[11px] text-emerald-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-medium truncate">In-Memory Store (No SQL)</span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Menu Utama
          </div>

          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/50 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Lihat Beranda Publik</span>
            </Link>
          </div>
        </div>

        {/* Current User Box & Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 flex items-center gap-3 mb-2 shadow-xs">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name}
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Pengguna'}</p>
              <div className="flex items-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    isAdmin ? 'bg-purple-500' : 'bg-emerald-500'
                  }`}
                />
                <p className="text-[11px] text-slate-500 truncate">{user?.role || 'Staff'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}

