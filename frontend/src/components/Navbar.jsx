import React from 'react';
import { Menu, Bell, Plus, User, Shield, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onToggleSidebar, title = 'Dashboard' }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
            Waste Management & Recycling Administration
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: New Transaction Button */}
        <button
          onClick={() => navigate('/transactions?create=true')}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all shadow-emerald-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Setor Sampah</span>
        </button>

        {/* Database-Free Indicator Pill */}
        <div
          title="Sistem berjalan dengan penyimpanan data sementara di memori backend (Tanpa database SQL)"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/70 rounded-full text-xs font-medium cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>In-Memory Storage</span>
        </div>

        {/* User Info & Role Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={user?.name}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <span
              className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

