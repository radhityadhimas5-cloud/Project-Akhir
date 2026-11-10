import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page title based on current path
  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Ikhtisar';
    if (pathname.startsWith('/waste')) return 'Manajemen Jenis Sampah';
    if (pathname.startsWith('/categories')) return 'Kategori Sampah Daur Ulang';
    if (pathname.startsWith('/customers')) return 'Manajemen Nasabah & Mitra';
    if (pathname.startsWith('/transactions')) return 'Transaksi Penyetoran Sampah';
    if (pathname.startsWith('/reports')) return 'Laporan & Statistik Pengelolaan';
    if (pathname.startsWith('/users')) return 'Manajemen Pengguna & Hak Akses';
    if (pathname.startsWith('/settings')) return 'Pengaturan Sistem Administrasi';
    return 'Waste Management System';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Waste Management System (MallSampah Inspiration). Beroperasi tanpa database permanen (In-Memory Temporary Storage).</p>
        </footer>
      </div>
    </div>
  );
}

