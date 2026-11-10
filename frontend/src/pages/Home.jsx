import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Recycle,
  BookOpen,
  Info,
  Scale,
  TrendingUp,
  Users2,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  HeartHandshake,
  Award,
  Globe2,
} from 'lucide-react';
import heroImg from '../assets/hero.png';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle sticky navbar elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      title: 'Pemilahan Sampah',
      tag: 'Segregasi Sumber',
      description:
        'Panduan dan sistem pemilahan presisi berdasarkan kategori material (PETE, HDPE, Kertas, Logam, Kaca, Organik) untuk menjaga nilai ekonomis daur ulang.',
      icon: Trash2,
      color: 'emerald',
    },
    {
      title: 'Pengelolaan & Penjemputan',
      tag: 'Logistik Ramah Lingkungan',
      description:
        'Layanan penjemputan berkala (Pick Up) untuk perumahan, restoran, kantor, dan fasilitas umum dengan armada terstandarisasi serta timbangan digital transparan.',
      icon: Recycle,
      color: 'blue',
    },
    {
      title: 'Edukasi Lingkungan',
      tag: 'Sosialisasi Berkelanjutan',
      description:
        'Program pendampingan, workshop circular economy, dan edukasi pemilahan sampah untuk sekolah, universitas, unit bank sampah binaan, dan komunitas.',
      icon: BookOpen,
      color: 'amber',
    },
    {
      title: 'Informasi Daur Ulang',
      tag: 'Katalog & Harga Pasar',
      description:
        'Transparansi katalog jenis sampah dengan acuan harga standar per kilogram (Rp/kg) serta pelacakan jejak daur ulang hingga menjadi produk bernilai baru.',
      icon: Info,
      color: 'purple',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Pilah Sampah Berdasarkan Jenisnya',
      description:
        'Pisahkan sampah rumah tangga atau usaha Anda menjadi kategori bernilai: botol plastik, kertas/kardus, kaleng logam, dan botol kaca dalam keadaan bersih.',
      icon: Trash2,
      badge: 'Langkah Awal',
    },
    {
      number: '02',
      title: 'Kelola & Kumpulkan Sampah',
      description:
        'Bawa ke titik Bank Sampah binaan terdekat atau jadwalkan penjemputan oleh tim petugas resmi kami untuk penimbangan digital yang akurat.',
      icon: Scale,
      badge: 'Penimbangan Digital',
    },
    {
      number: '03',
      title: 'Daur Ulang & Raih Manfaat',
      description:
        'Sampah dikonversi menjadi tabungan rupiah langsung dan disalurkan ke fasilitas daur ulang terpercaya guna menciptakan ekosistem bumi yang bersih lestari.',
      icon: Recycle,
      badge: 'Ekonomi Sirkular',
    },
  ];

  const stats = [
    { label: 'Total Sampah Terkumpul', value: '285.400+ kg', change: '+18% bln ini', icon: Scale },
    { label: 'Tingkat Daur Ulang Efektif', value: '94.2%', change: 'Efisiensi Tinggi', icon: Recycle },
    { label: 'Nasabah & Mitra Aktif', value: '12.500+', change: 'Perorangan & UKM', icon: Users2 },
    { label: 'Unit Bank Sampah Binaan', value: '180+ Unit', change: 'Tersebar di Jabodetabek', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center border-b border-emerald-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>MallSampah Recycling Network:</strong> Akses Bank Sampah Digital & Daur Ulang Terintegrasi untuk Semua Orang.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-emerald-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Hotline: 0811-4455-667
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Jakarta & Kota Penyangga
            </span>
          </div>
        </div>
      </div>

      {/* 2. STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight block">
                MallSampah
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block -mt-0.5">
                Waste Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('beranda')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Layanan
            </button>
            <button
              onClick={() => scrollToSection('cara-kerja')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => scrollToSection('informasi')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Informasi
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Kontak
            </button>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              Masuk
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <span>Portal Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 bg-white border-b border-slate-200/80 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <button
                onClick={() => scrollToSection('beranda')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('tentang')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Tentang Kami
              </button>
              <button
                onClick={() => scrollToSection('layanan')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Layanan
              </button>
              <button
                onClick={() => scrollToSection('cara-kerja')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Cara Kerja
              </button>
              <button
                onClick={() => scrollToSection('informasi')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Informasi & Statistik
              </button>
              <button
                onClick={() => scrollToSection('kontak')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Kontak
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-semibold text-sm text-slate-700"
              >
                Masuk ke Akun
              </Link>
              <Link
                to="/login"
                className="w-full text-center py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-sm"
              >
                Buka Portal Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="beranda" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solusi Daur Ulang & Pengelolaan Sampah Cerdas</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Kelola Sampah Hari Ini,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Selamatkan Lingkungan Esok Hari.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ubah sampah rumah tangga dan limbah bisnis menjadi tabungan bernilai ekonomis.
                Kami menyediakan jaringan daur ulang terpadu, penimbangan transparan, dan edukasi keberlanjutan untuk mewujudkan Indonesia bebas sampah.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('tentang')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Transparansi Harga</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">180+</div>
                  <div className="text-xs text-slate-500 font-medium">Titik Bank Sampah</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">280 Ton</div>
                  <div className="text-xs text-slate-500 font-medium">Sampah Terdiversi</div>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-emerald-100 to-teal-50">
                  <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
                    alt="Waste Sorting & Recycling Illustration"
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Recycle className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Jaringan Daur Ulang Aktif</h4>
                        <p className="text-[11px] text-slate-500">Mendukung gerakan Zero Waste to Landfill</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-gentle">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Timbangan Presisi</span>
                    <span className="text-xs font-bold text-slate-900">Kalkulasi Otomatis (Rp/kg)</span>
                  </div>
                </div>

                {/* Floating Metric Card 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Laporan Realtime</span>
                    <span className="text-xs font-bold text-slate-900">100% Bukti Struk Cetak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="tentang" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Left */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80"
                      alt="Eco Forestry"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <HeartHandshake className="w-7 h-7 text-emerald-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Pemberdayaan Masyarakat</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Mendorong kebiasaan memilah sampah berbasis insentif langsung.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
                    <Globe2 className="w-7 h-7 text-teal-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Dampak Lingkungan</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Mencegah ribuan ton sampah plastik mencemari laut dan sungai.
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=500&auto=format&fit=crop&q=80"
                      alt="Sorting Bottles"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                <span>Misi & Dedikasi Kami</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Menyediakan Akses Daur Ulang yang Mudah, Adil, dan Transparan Bagi Semua Orang
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                MallSampah dibangun sebagai jembatan ekologis antara penghasil sampah (rumah tangga, restoran, kantor, dan komunitas) dengan industri daur ulang profesional.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Digitalisasi pencatatan penimbangan sampah dengan konversi rupiah langsung.',
                  'Jaringan logistik penjemputan sampah terintegrasi tanpa repot.',
                  'Edukasi berkesinambungan untuk membentuk budaya pilah sampah dari sumber.',
                  'Transparansi alur rantai pasok daur ulang yang bertanggung jawab.',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => scrollToSection('layanan')}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  Eksplorasi Layanan Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section id="layanan" className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Layanan Utama
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Solusi Terpadu Pengelolaan Sampah & Daur Ulang
            </h2>
            <p className="text-sm text-slate-500">
              Mulai dari skala rumah tangga hingga korporasi besar, kami menghadirkan layanan menyeluruh untuk lingkungan yang lebih sehat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {svc.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span>Pelajari Detail</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="cara-kerja" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Alur Sederhana
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tiga Langkah Mudah Mendaur Ulang Sampah
            </h2>
            <p className="text-sm text-slate-500">
              Proses cepat, mudah, dan transparan mulai dari pemilahan awal hingga pencairan nilai manfaat tabungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-slate-50/80 rounded-3xl p-7 border border-slate-200/80 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                      {st.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-white rounded-full border border-slate-200 text-slate-600 shadow-2xs">
                      {st.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-emerald-600/30">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{st.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. ENVIRONMENTAL STATISTICS BANNER */}
      <section id="informasi" className="py-16 bg-gradient-to-tr from-emerald-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Dampak Terukur
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Statistik Kontribusi Bersama Menjaga Bumi
            </h2>
            <p className="text-xs text-slate-300">
              Angka nyata akumulasi pengurangan sampah yang berhasil dialihkan dari Tempat Pembuangan Akhir (TPA).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      {item.change}
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs font-medium text-slate-300">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-16 md:py-20 bg-emerald-50/60 border-t border-b border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <Leaf className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
            Siap Berkontribusi Menjadikan Lingkungan Bersih dan Bernilai?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Bergabunglah bersama ribuan nasabah dan mitra unit bank sampah kami. Pilah sampah Anda sekarang dan nikmati manfaat finansialnya secara instan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <span>Gabung Sekarang (Masuk Portal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-xs transition-all text-sm sm:text-base"
            >
              Hubungi Tim Kami
            </button>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & INFO SECTION */}
      <section id="kontak" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Pusat Informasi & Hubungi Kami
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Konsultasikan Pengelolaan Sampah Bersama Tim Ahli Kami
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Punya pertanyaan mengenai jenis sampah yang diterima, penjemputan skala industri, atau pendirian bank sampah baru? Kami siap membantu.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Alamat Kantor Pusat:</strong>
                    <span>Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Layanan WhatsApp & Telepon:</strong>
                    <span>+62 811-4455-667 (Senin - Sabtu: 08.00 - 17.00 WIB)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Email Korespondensi:</strong>
                    <span>contact@mallsampah.com / info@mallsampah.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="lg:col-span-7 bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Kirim Pesan atau Pertanyaan Penjemputan
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                Tim layanan kami akan merespons pesan Anda dalam waktu maksimal 1x24 jam.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Terima kasih! Pesan dan permohonan informasi Anda telah terkirim ke customer support MallSampah.');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Handphone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0812-3456-7890"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topik / Keperluan
                  </label>
                  <select className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option>Penjemputan Sampah Rumah Tangga (Pick Up)</option>
                    <option>Kemitraan Limbah Restoran & Bisnis Kuliner</option>
                    <option>Pengelolaan Sampah Perusahaan / Kantor</option>
                    <option>Pendirian & Pembinaan Unit Bank Sampah Baru</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Pesan / Keterangan Tambahan *
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tuliskan estimasi berat sampah, lokasi alamat penjemputan, atau pertanyaan Anda..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors"
                >
                  Kirim Pesan Sekarang
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">
                  MallSampah
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Sistem pengelolaan bank sampah digital dan jaringan daur ulang terintegrasi. Mewujudkan sirkularitas material dan kelestarian bumi untuk generasi masa depan.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                🌱 In-Memory Temporary System • Standar Arsitektur Bersih
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Navigasi</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('beranda')} className="hover:text-emerald-400">
                    Beranda
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('tentang')} className="hover:text-emerald-400">
                    Tentang Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('layanan')} className="hover:text-emerald-400">
                    Layanan
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('cara-kerja')} className="hover:text-emerald-400">
                    Cara Kerja
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('informasi')} className="hover:text-emerald-400">
                    Informasi & Statistik
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Admin */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Akses Portal</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-emerald-400">
                    Masuk Akun Petugas
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-emerald-400">
                    Dashboard Ikhtisar
                  </Link>
                </li>
                <li>
                  <Link to="/transactions" className="hover:text-emerald-400">
                    Pencatatan Penyetoran
                  </Link>
                </li>
                <li>
                  <Link to="/waste" className="hover:text-emerald-400">
                    Katalog Harga Sampah
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="hover:text-emerald-400">
                    Laporan Ekologis
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contacts */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Kontak Cepat</h5>
              <p className="text-xs leading-relaxed">
                Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160
              </p>
              <p className="text-xs">Hotline: 0811-4455-667</p>
              <p className="text-xs">Email: contact@mallsampah.com</p>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Waste Management System (MallSampah Inspiration). Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-emerald-400 hover:underline">
                Portal Administrator & Kasir
              </Link>
              <span>•</span>
              <span>Clean SaaS Design</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

