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
  Truck,
  Calendar,
  DollarSign,
  Star,
  FileText,
  Check,
  Layers,
  Droplets,
  Zap,
  Package,
  Box,
  Share2,
  Send,
  Coffee,
  ShoppingBag,
  HelpCircle,
  Calculator,
  Compass,
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [calcMaterial, setCalcMaterial] = useState('WST-001');
  const [calcWeight, setCalcWeight] = useState(15);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const navigate = useNavigate();

  // Scroll detection for sticky navbar shadow
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

  // 1. MallSampah Inspired Core Services
  const services = [
    {
      id: 'pickup',
      title: 'Pick Up',
      badge: 'Penjemputan Terjadwal',
      description:
        'Penjemputan sampah daur ulang langsung ke rumah atau lokasi usaha Anda sesuai jadwal yang ditentukan. Tanpa repot mengangkut sendiri.',
      features: ['Min. 10 kg', 'Armada Resmi SampahPay', 'Timbangan Digital di Tempat', 'Bayar Tunai / Saldo'],
      icon: Truck,
      color: 'emerald',
      popular: true,
    },
    {
      id: 'dropoff',
      title: 'Drop Off',
      badge: 'Setor Mandiri',
      description:
        'Bawa sampah daur ulang Anda ke Drop Off point atau Unit Bank Sampah mitra SampahPay terdekat kapan pun Anda luang.',
      features: ['Bebas Minimum Berat', 'Tersedia di 180+ Titik', 'Langsung Ditimbang', 'Pencatatan Instan'],
      icon: MapPin,
      color: 'teal',
      popular: false,
    },
    {
      id: 'company',
      title: 'Company',
      badge: 'Solusi Bisnis & Kantor',
      description:
        'Layanan terpadu pengelolaan sampah operasional restoran, kafe, hotel, perkantoran, dan fasilitas umum dengan audit berkala.',
      features: ['Jadwal Harian/Mingguan', 'Laporan Timbulan Bulanan', 'Sertifikat Daur Ulang', 'Dukungan Kepatuhan ESG'],
      icon: Building2,
      color: 'blue',
      popular: false,
    },
    {
      id: 'event',
      title: 'Event',
      badge: 'Kelola Sampah Acara',
      description:
        'Dukungan manajemen sampah khusus festival, pameran, konser, bazar, dan seminar untuk mewujudkan Zero-Waste Event yang bersih.',
      features: ['Penyediaan Tempat Sampah Pilah', 'Tim Edukator di Lapangan', 'Pengangkutan Cepat', 'Laporan Dampak Acara'],
      icon: Calendar,
      color: 'amber',
      popular: false,
    },
  ];

  // 2. MallSampah Inspired "Jenis Sampah" (Waste Categories & Types)
  const wasteCategories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'plastik', label: 'Plastik' },
    { id: 'kertas', label: 'Kertas & Karton' },
    { id: 'logam', label: 'Besi & Logam' },
    { id: 'kaca', label: 'Kaca & Botol' },
    { id: 'minyak', label: 'Minyak Jelantah' },
    { id: 'organik', label: 'Organik' },
  ];

  const wasteTypes = [
    {
      id: 'WST-001',
      category: 'plastik',
      name: 'Botol Plastik PET Bening',
      description: 'Botol air mineral bersih tanpa tutup dan label, dipres padat.',
      price: 4500,
      unit: 'kg',
      icon: Recycle,
      accent: 'emerald',
      popular: true,
    },
    {
      id: 'WST-002',
      category: 'plastik',
      name: 'Plastik HDPE (Jerigen / Sabun)',
      description: 'Jerigen minyak, botol sampo, wadah detergen tebal berwarna.',
      price: 3800,
      unit: 'kg',
      icon: Box,
      accent: 'emerald',
      popular: false,
    },
    {
      id: 'WST-003',
      category: 'plastik',
      name: 'Gelas Plastik PP Cup',
      description: 'Cup plastik es kopi, boba, dan jus bersih tanpa sealer plastik.',
      price: 3200,
      unit: 'kg',
      icon: Package,
      accent: 'emerald',
      popular: false,
    },
    {
      id: 'WST-004',
      category: 'kertas',
      name: 'Kardus Bekas Gelombang',
      description: 'Kardus kemasan cokelat kering, dilipat rapi bebas isolasi berlebih.',
      price: 2200,
      unit: 'kg',
      icon: Layers,
      accent: 'amber',
      popular: true,
    },
    {
      id: 'WST-005',
      category: 'kertas',
      name: 'Kertas Arsip Putih / HVS',
      description: 'Kertas dokumen kantor, print HVS tanpa staples, dan buku tulis.',
      price: 2800,
      unit: 'kg',
      icon: FileText,
      accent: 'amber',
      popular: false,
    },
    {
      id: 'WST-006',
      category: 'logam',
      name: 'Kaleng Minuman Alumunium',
      description: 'Kaleng soda, minuman sarang burung, larutan penyegar bebas cairan.',
      price: 14000,
      unit: 'kg',
      icon: Zap,
      accent: 'purple',
      popular: true,
    },
    {
      id: 'WST-007',
      category: 'logam',
      name: 'Besi Padu & Seng Scrap',
      description: 'Potongan besi konstruksi, paku, seng atap, dan plat logam perabot.',
      price: 5500,
      unit: 'kg',
      icon: ShieldCheck,
      accent: 'purple',
      popular: false,
    },
    {
      id: 'WST-008',
      category: 'kaca',
      name: 'Botol Kaca Utuh & Bersih',
      description: 'Botol kecap, sirup, bir, dan toples kaca bersih tidak retak.',
      price: 1200,
      unit: 'kg',
      icon: Sparkles,
      accent: 'cyan',
      popular: false,
    },
    {
      id: 'WST-010',
      category: 'minyak',
      name: 'Minyak Jelantah Saring Bersih',
      description: 'Minyak goreng bekas pakai yang disaring dalam botol/jerigen.',
      price: 7500,
      unit: 'kg',
      icon: Droplets,
      accent: 'yellow',
      popular: true,
    },
    {
      id: 'WST-009',
      category: 'organik',
      name: 'Sampah Organik & Dedaunan',
      description: 'Sisa sayur dapur, sisa buah, ampas kelapa, dan potongan daun kebun.',
      price: 800,
      unit: 'kg',
      icon: Leaf,
      accent: 'green',
      popular: false,
    },
  ];

  const filteredWaste =
    activeTab === 'all'
      ? wasteTypes
      : wasteTypes.filter((w) => w.category === activeTab);

  // Material selected for interactive calculator
  const selectedMaterialObj =
    wasteTypes.find((w) => w.id === calcMaterial) || wasteTypes[0];
  const calculatedTotal = selectedMaterialObj.price * calcWeight;
  const calculatedCO2 = (calcWeight * 1.5).toFixed(1); // 1.5 kg CO2 avoided per kg waste recycled

  // 3. MallSampah "Solusi Kami" (Target Audience Segmentation)
  const solutions = [
    {
      title: 'For Everyone',
      subtitle: 'Individu & Rumah Tangga',
      image:
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      desc: 'Pilah sampah dari rumah dan ubah kardus, botol plastik, serta minyak jelantah menjadi saldo tabungan uang tunai yang bermanfaat.',
      linkText: 'Lihat Panduan Warga',
      badge: 'Solusi Rumah Tangga',
    },
    {
      title: 'For Business',
      subtitle: 'Kafe, Restoran & Ritel UMKM',
      image:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
      desc: 'Kelola limbah kemasan dan minyak goreng bekas pakai secara higienis dengan jadwal jemput rutin serta rekap timbulan berkala.',
      linkText: 'Daftar Mitra Bisnis',
      badge: 'Solusi UMKM Kuliner',
    },
    {
      title: 'For Corporate & Brand',
      subtitle: 'Perusahaan, Pabrik & Gedung',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      desc: 'Wujudkan kepatuhan Environmental, Social, and Governance (ESG) dan Extended Producer Responsibility (EPR) melalui laporan jejak daur ulang transparan.',
      linkText: 'Konsultasi ESG Korporat',
      badge: 'Kepatuhan ESG',
    },
  ];

  // 4. Wastix Testimonials
  const testimonials = [
    {
      name: 'Siti Nurhaliza',
      role: 'Ibu Rumah Tangga, Jakarta Selatan',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'Sangat terbantu dengan layanan Pick Up SampahPay. Sampah botol mineral dan kardus paket belanja online tidak lagi menumpuk di garasi. Ditimbang jujur di depan mata dan uangnya langsung masuk tabungan!',
    },
    {
      name: 'Hendra Prasetyo',
      role: 'Owner Kopi Seduh & Resto, Tangerang',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'Dulu minyak jelantah dan cup plastik sisa jualan bingung mau dibuang ke mana. Bersama SampahPay, setiap minggu armada datang tepat waktu. Restoran kami jadi bersih dan punya sertifikat daur ulang resmi.',
    },
    {
      name: 'Ratna Wulandari',
      role: 'Ketua Bank Sampah Asri Lestari, Bandung',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment:
        'Sistem pencatatan digital SampahPay sangat memudahkan pengurus warga. Harganya transparan, struk cetaknya rapi, dan warga semakin semangat memilah sampah dari rumah masing-masing.',
    },
  ];

  // 5. Wastix Educational Articles / Blog Posts
  const articles = [
    {
      title: '5 Langkah Praktis Memilah Sampah Plastik Agar Bernilai Jual Maksimal',
      category: 'Tips Pemilahan',
      readTime: '4 mnt baca',
      date: '10 November 2026',
      image:
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
      excerpt:
        'Ketahui perbedaan jenis plastik PETE, HDPE, dan PP serta cara membersihkannya agar diterima pabrik daur ulang dengan harga terbaik.',
    },
    {
      title: 'Perjalanan Minyak Jelantah Dapur Menjadi Energi Biodiesel Terbarukan',
      category: 'Teknologi Daur Ulang',
      readTime: '6 mnt baca',
      date: '08 November 2026',
      image:
        'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80',
      excerpt:
        'Jangan buang minyak bekas ke saluran air! Simak bagaimana SampahPay menyalurkan jelantah menjadi bahan bakar ramah lingkungan.',
    },
    {
      title: 'Panduan Zero-Waste Praktis untuk Kafe dan Pengusaha Kuliner Modern',
      category: 'Solusi Bisnis',
      readTime: '5 mnt baca',
      date: '03 November 2026',
      image:
        'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&auto=format&fit=crop&q=80',
      excerpt:
        'Strategi mengurangi sampah kemasan sekali pakai dan meningkatkan citra ramah lingkungan (eco-friendly) di mata pelanggan setia Anda.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 text-center border-b border-emerald-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>SampahPay Recycling Network:</strong> Akses Bank Sampah Digital & Jaringan Daur Ulang Terintegrasi untuk Semua Orang.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-5 text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Hotline: 0811-4455-667
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Sen - Sab 08:00 - 17:00 WIB
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Layanan Jabodetabek & Bandung
            </span>
          </div>
        </div>
      </div>

      {/* 2. STICKY MODERN NAVBAR */}
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
                SampahPay
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block -mt-0.5">
                Recycling & Waste System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('beranda')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('misi')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Misi & Dampak
            </button>
            <button
              onClick={() => scrollToSection('layanan')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Layanan
            </button>
            <button
              onClick={() => scrollToSection('jenis-sampah')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Jenis Sampah
            </button>
            <button
              onClick={() => scrollToSection('solusi')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Solusi Kami
            </button>
            <button
              onClick={() => scrollToSection('pengalaman')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Pengalaman
            </button>
            <button
              onClick={() => scrollToSection('testimoni')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Ulasan
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
              Masuk Akun
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <span>Portal Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden px-4 pt-3 pb-6 bg-white border-b border-slate-200/80 space-y-3 animate-fadeIn">
            <div className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
              <button
                onClick={() => scrollToSection('beranda')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('misi')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Misi & Dampak
              </button>
              <button
                onClick={() => scrollToSection('layanan')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Layanan
              </button>
              <button
                onClick={() => scrollToSection('jenis-sampah')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Jenis Sampah
              </button>
              <button
                onClick={() => scrollToSection('solusi')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Solusi Kami
              </button>
              <button
                onClick={() => scrollToSection('pengalaman')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Pengalaman
              </button>
              <button
                onClick={() => scrollToSection('testimoni')}
                className="text-left py-2 px-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
              >
                Ulasan Nasabah
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
                className="w-full text-center py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm"
              >
                Buka Portal Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (Hybrid MallSampah & Wastix) */}
      <section
        id="beranda"
        className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50"
      >
        {/* Decorative Green Curve & Glow */}
        <div className="absolute top-0 right-0 -mr-28 -mt-28 w-[500px] h-[500px] rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-28 -mb-28 w-[500px] h-[500px] rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solusi Penjemputan & Daur Ulang Sampah Digital Terpadu</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Kelola Sampah Hari Ini,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                  Selamatkan Lingkungan Esok Hari.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ubah sampah rumah tangga, restoran, dan limbah kemasan bisnis menjadi saldo tabungan bernilai ekonomis.
                Kami menyediakan jaringan daur ulang modern, penimbangan digital presisi, dan armada penjemputan terjadwal.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollToSection('jenis-sampah')}
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Simulasi Tabungan Sampah</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Transparan & Jujur</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">180+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Titik Bank Sampah</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">285k+ Kg</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Sampah Terdiversi</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Organic Curved Mask & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Visual Image Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-emerald-50">
                  <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
                    alt="Pilah Sampah dan Daur Ulang SampahPay"
                    className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                  {/* Organic Green Pill Label in Image */}
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Mitra Sirkularitas Indonesia</span>
                  </div>

                  {/* Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
                        <Recycle className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Jaringan Daur Ulang Aktif
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Mendukung gerakan bebas sampah (Zero Waste to Landfill)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Badge 1 (Top Left) */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Timbangan Presisi</span>
                    <span className="text-xs font-bold text-slate-900">Akurat Hingga Gram</span>
                  </div>
                </div>

                {/* Floating Metric Badge 2 (Bottom Right) */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaksi Resmi</span>
                    <span className="text-xs font-bold text-slate-900">Struk Cetak & Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. WASTIX STYLE 3 FLOATING BUCKET CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500 rounded-t-3xl" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Wadah & Pemilahan Mudah
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Panduan pemilahan material terstandarisasi untuk kategori plastik, kertas, kaleng logam, dan kaca agar nilai jual optimal.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal-500 rounded-t-3xl" />
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Timbangan Digital Transparan
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penimbangan akurat langsung di tempat dengan harga pasar Rp/kg yang terbuka tanpa pemotongan tersembunyi.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-500 rounded-t-3xl" />
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Penjemputan Fleksibel
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Armada kurir siap menjemput sampah ke rumah, ruko, restoran, maupun kantor Anda pada waktu yang disepakati.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MALLSAMPAH INSPIRED GREEN MISSION & IMPACT BANNER */}
      <section id="misi" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Mission Text */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold border border-emerald-500/30">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>We are The Recycling Network</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Misi Kami Menyediakan Akses Daur Ulang Bagi Semua Orang
                </h2>
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                  SampahPay menghubungkan masyarakat penghasil sampah dengan jaringan pengumpul dan industri daur ulang melalui teknologi penimbangan digital dan kompensasi langsung.
                </p>
              </div>

              {/* Verified Metrics Counter Grid */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">50+</div>
                  <div className="text-xs text-emerald-100 font-medium mt-1">Kota & Wilayah</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">100k+</div>
                  <div className="text-xs text-emerald-100 font-medium mt-1">Pengguna Terdaftar</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">1.500+</div>
                  <div className="text-xs text-emerald-100 font-medium mt-1">Mitra Pengumpul</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">850+ Ton</div>
                  <div className="text-xs text-emerald-100 font-medium mt-1">Sampah Dikelola</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MALLSAMPAH 4 CORE SERVICES (Pick Up, Drop Off, Company, Event) */}
      <section id="layanan" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Layanan SampahPay
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Layanan Pengelolaan Sampah untuk Segala Kebutuhan
            </h2>
            <p className="text-sm text-slate-500">
              Dari penjemputan ke pintu rumah hingga audit limbah korporasi terintegrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between group relative ${
                    svc.popular
                      ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {svc.popular && (
                    <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Paling Populer
                    </div>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {svc.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {svc.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {svc.description}
                    </p>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      {svc.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => scrollToSection('kontak')}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Pesan Layanan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. MALLSAMPAH "JENIS SAMPAH" GRID & INTERACTIVE VALUE CALCULATOR */}
      <section id="jenis-sampah" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Katalog Material & Acuan Harga
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Jenis Sampah yang Diterima
            </h2>
            <p className="text-sm text-slate-500">
              Daftar kategori sampah terpilah dengan acuan harga standar pasar per kilogram (Rp/kg).
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {wasteCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Waste Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredWaste.map((w) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    setCalcMaterial(w.id);
                    scrollToSection('kalkulator');
                  }}
                  className="bg-slate-50/80 hover:bg-emerald-50/60 rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                        {w.category}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700">
                      {w.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                      {w.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Estimasi Harga</span>
                      <span className="text-xs font-black text-emerald-700 font-mono">
                        Rp {w.price.toLocaleString('id-ID')} /{w.unit}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 group-hover:underline flex items-center gap-0.5">
                      Hitung <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Price Calculator (Simulasi Tabungan Sampah) */}
          <div id="kalkulator" className="mt-12 bg-gradient-to-tr from-emerald-50 to-teal-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kalkulator Tabungan Sampah</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Simulasikan Nilai Sampah Anda Sekarang
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pilih jenis sampah terpilah dan masukkan perkiraan berat dalam kilogram (kg) untuk melihat estimasi rupiah yang akan Anda peroleh.
                </p>
              </div>

              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Waste Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pilih Jenis Sampah
                    </label>
                    <select
                      value={calcMaterial}
                      onChange={(e) => setCalcMaterial(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    >
                      {wasteTypes.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} (Rp {w.price.toLocaleString('id-ID')}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Perkiraan Berat (kg)
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {calcWeight} kg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Estimasi Nilai Tabungan
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                      Rp {calculatedTotal.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Acuan: Rp {selectedMaterialObj.price.toLocaleString('id-ID')} / kg × {calcWeight} kg
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Dampak Lingkungan
                    </span>
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      Mencegah ~{calculatedCO2} kg Emisi CO₂
                    </span>
                    <button
                      onClick={() => navigate('/login')}
                      className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Setor Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MALLSAMPAH "SOLUSI KAMI" (For Everyone, For Business, For Corporate) */}
      <section id="solusi" className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Solusi Kami
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dukungan Spesifik Sesuai Kategori Pengguna
            </h2>
            <p className="text-sm text-slate-500">
              Kami merancang solusi yang relevan bagi individu, pelaku bisnis kuliner, hingga perusahaan multinasional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((sol, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={sol.image}
                    alt={sol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-bold text-slate-800 shadow-sm">
                    {sol.badge}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-0.5">{sol.title}</h3>
                    <h4 className="text-xs font-bold text-emerald-600 mb-3">{sol.subtitle}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{sol.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => scrollToSection('kontak')}
                      className="w-full py-2.5 rounded-xl border border-emerald-600/30 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{sol.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WASTIX EXPERIENCE IN WASTE MANAGEMENT & OPERATIONAL COLLAGE */}
      <section id="pengalaman" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Collage Left */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80"
                      alt="Pekerja Daur Ulang SampahPay"
                      className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100">
                    <Award className="w-7 h-7 text-emerald-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">SOP Standar Industri</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Proses pengumpulan, pemilahan, dan pengepakan sampah sesuai regulasi lingkungan hidup.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-5 rounded-3xl bg-teal-50 border border-teal-100">
                    <HeartHandshake className="w-7 h-7 text-teal-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Pemberdayaan Mitra</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Membina lebih dari 1.500 pemulung dan petugas bank sampah dengan penghasilan yang adil.
                    </p>
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&auto=format&fit=crop&q=80"
                      alt="Sorting Line"
                      className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pengalaman & Dedikasi</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Pengalaman Teruji dalam Tata Kelola Daur Ulang Sampah Terintegrasi
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                SampahPay hadir sebagai solusi sistematis untuk mengatasi problem sampah perkotaan di Indonesia. Melalui sistem pencatatan penimbangan digital dan jaringan logistik terpercaya, kami memastikan sampah yang Anda setorkan benar-benar didaur ulang menjadi material baru yang bernilai tinggi.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  'Harga transparan dan terbarui otomatis setiap minggu sesuai tren pasar.',
                  'Timbangan digital resmi dengan bukti struk cetak dan riwayat transaksi realtime.',
                  'Armada pick-up siap menjemput sampah tanpa membebani rutinitas harian Anda.',
                  'Didukung tim profesional di bawah supervisi tim administrator & staff operasional resmi.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Emergency Hotline Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Layanan Darurat & Konsultasi
                    </span>
                    <span className="text-sm font-extrabold">0811-4455-667</span>
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('kontak')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WASTIX STYLE TESTIMONIALS (What Our Clients Say) */}
      <section id="testimoni" className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Ulasan Pengguna
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Apa Kata Nasabah & Mitra SampahPay
            </h2>
            <p className="text-sm text-slate-500">
              Testimoni nyata dari ibu rumah tangga, pengusaha kafe, hingga koordinator bank sampah warga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. WASTIX OPERATIONAL PHOTO GALLERY */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
              Galeri Operasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aktivitas Pengelolaan Sampah Nyata di Lapangan
            </h2>
            <p className="text-xs text-slate-500">
              Dokumentasi proses penjemputan, pemilahan, dan daur ulang oleh tim resmi SampahPay.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-xs group h-48 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&auto=format&fit=crop&q=80"
                alt="Armada Pengangkut Sampah"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xs group h-48 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=80"
                alt="Pemilahan Botol Plastik"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xs group h-48 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&auto=format&fit=crop&q=80"
                alt="Pekerja Daur Ulang SampahPay"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xs group h-48 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80"
                alt="Lingkungan Hijau Lestari"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 12. WASTIX ARTICLES & EDUKASI DAUR ULANG (Get More Updates) */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Edukasi & Wawasan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Artikel & Berita Seputar Daur Ulang
            </h2>
            <p className="text-sm text-slate-500">
              Pelajari tren ekonomi sirkular, trik pemilahan sampah bernilai tinggi, dan aksi lingkungan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                    {art.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. NEWSLETTER & CONTACT FORM SECTION (Wastix & MallSampah Hybrid) */}
      <section id="kontak" className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Newsletter Box */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Berlangganan Newsletter & Tips Hijau
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Dapatkan notifikasi perubahan harga acuan sampah, tips pemilahan rumah tangga, dan informasi jadwal penjemputan berkala langsung di email Anda.
              </p>

              {newsletterSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-700/80 text-white font-bold text-xs sm:text-sm border border-emerald-400/40">
                  🎉 Terima kasih telah berlangganan! Informasi daur ulang terbaru akan kami kirimkan ke inbox Anda.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSubmitted(true);
                  }}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Masukkan alamat email Anda..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    Langganan
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Inquiry & Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details Left */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
                Pusat Bantuan & Kontak
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Konsultasikan Kebutuhan Pengelolaan Sampah Anda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Punya pertanyaan terkait jadwal pick up wilayah Anda, penimbangan limbah industri, atau registrasi unit bank sampah baru? Tim kami siap mendampingi Anda.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Alamat Kantor Pusat:</strong>
                    <span>Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Hotline Telepon & WhatsApp:</strong>
                    <span>+62 811-4455-667 (Senin - Sabtu: 08.00 - 17.00 WIB)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Email Resmi:</strong>
                    <span>contact@sampahpay.com / info@sampahpay.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form Right */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Kirim Permohonan Penjemputan / Konsultasi
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                Isi formulir di bawah ini dan perwakilan customer support SampahPay akan menghubungi Anda dalam waktu 1x24 jam kerja.
              </p>

              {inquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-100 text-emerald-800 text-center space-y-2 border border-emerald-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Pesan Berhasil Terkirim!</h4>
                  <p className="text-xs text-emerald-700">
                    Terima kasih atas kepedulian Anda terhadap lingkungan. Tim customer support SampahPay akan segera memverifikasi data dan menghubungi Anda.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInquirySubmitted(true);
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
                        placeholder="Nama Lengkap Anda"
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
                      Kebutuhan Layanan
                    </label>
                    <select className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option>Pick Up Sampah Terjadwal (Rumah Tangga)</option>
                      <option>Pengelolaan Limbah Kafe & Restoran (UMKM)</option>
                      <option>Program Limbah Kantor & Gedung (Company)</option>
                      <option>Layanan Daur Ulang Event / Acara</option>
                      <option>Kemitraan Pendirian Unit Bank Sampah Baru</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Keterangan / Alamat Penjemputan *
                    </label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Tuliskan estimasi berat sampah, jenis material terpilah, dan alamat lokasi penjemputan..."
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Kirim Pesan Sekarang
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 14. ELEGANT ECO FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight block">
                    SampahPay
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Daur Ulang Digital Indonesia
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Sistem pengelolaan bank sampah digital dan jaringan daur ulang terintegrasi. Mewujudkan sirkularitas material dan kelestarian bumi untuk generasi masa depan.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold space-y-1">
                <div>🌱 Didukung oleh Tim Administrator: <strong>Radhitya Dhimas Ardyansyah</strong></div>
                <div>🌱 Supervisi Staff Operasional: <strong>Imania Ambarwati</strong></div>
              </div>
            </div>

            {/* Col 2: Navigasi */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Navigasi</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('beranda')} className="hover:text-emerald-400 cursor-pointer">
                    Beranda
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('misi')} className="hover:text-emerald-400 cursor-pointer">
                    Misi & Dampak
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('layanan')} className="hover:text-emerald-400 cursor-pointer">
                    Layanan Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('jenis-sampah')} className="hover:text-emerald-400 cursor-pointer">
                    Jenis Sampah
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('solusi')} className="hover:text-emerald-400 cursor-pointer">
                    Solusi Kami
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('testimoni')} className="hover:text-emerald-400 cursor-pointer">
                    Ulasan Pengguna
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Portal Admin & Akses Petugas */}
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
                  <Link to="/customers" className="hover:text-emerald-400">
                    Manajemen Nasabah
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="hover:text-emerald-400">
                    Laporan Ekologis
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Kontak Cepat */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Kontak Cepat</h5>
              <p className="text-xs leading-relaxed">
                Jl. Pelita Harapan Indah No. 108, Jakarta Selatan 12160
              </p>
              <p className="text-xs">Hotline: 0811-4455-667</p>
              <p className="text-xs">Email: contact@sampahpay.com</p>
              <p className="text-xs">Email Support: info@sampahpay.com</p>
            </div>
          </div>

          {/* Copyright & Subtitle */}
          <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} SampahPay. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-emerald-400 hover:underline">
                Portal Administrator & Petugas
              </Link>
              <span>•</span>
              <span>Inspired by MallSampah & Modern Clean Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
