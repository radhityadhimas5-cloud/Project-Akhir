# SampahPay — Waste Management and Recycling Administration System
> Platform digital pengelolaan bank sampah modern & sirkularitas daur ulang.

Aplikasi web terintegrasi untuk pengelolaan bank sampah, pendataan nasabah, pencatatan transaksi penimbangan dengan kalkulasi nilai rupiah otomatis, cetak struk bukti setor, visualisasi analitik grafik Chart.js, serta pelaporan ekologis komprehensif.

---

## 1. Teknologi yang Digunakan

### Frontend
- **React.js 19**: Library antarmuka berbasis komponen modular.
- **Tailwind CSS 3**: Styling framework utilitas modern untuk tata letak responsif dan estetik ramah lingkungan.
- **Lucide React**: Ikonografi SaaS profesional dan konsisten.
- **Chart.js & React-Chartjs-2**: Visualisasi grafik interaktif tren pengumpulan, komposisi kategori, dan perputaran nilai ekonomi.
- **Axios**: Klien HTTP untuk komunikasi dengan backend Laravel via RESTful API.
- **React Router DOM 7**: Pengelolaan rute halaman publik, portal login, dan dashboard terproteksi.

### Backend
- **Laravel 11 / 13 (PHP 8.3+)**: Framework backend penyedia RESTful API.
- **Repository Pattern & Service Layer**: Pemisahan tanggung jawab (*separation of concerns*) antara logika bisnis dan akses data.
- **In-Memory Temporary Data Storage**: Penyimpanan data sementara berbasis memori dan file JSON lokal backend (`backend/storage/app/temporary_store.json`), **100% bebas dari dependensi database SQL (tanpa MySQL/MariaDB/SQLite migrations)**.
- **Role-Based Access Control (RBAC)**: Otorisasi terpisah untuk peran **Administrator** (akses penuh) dan **Staff** (kasir penimbangan & nasabah).

---

## 2. Struktur Proyek

```text
Project Akhir Workshop Teknologi Web dan Aplikasi/
│
├── frontend/                              # Aplikasi React + Tailwind CSS
│   ├── public/                            # Favicon dan aset statis
│   ├── src/
│   │   ├── assets/                        # Gambar & ilustrasi (hero.png)
│   │   ├── components/                    # Komponen antarmuka modular
│   │   │   ├── Navbar.jsx                 # Top bar dengan breadcrumb & profil
│   │   │   ├── Sidebar.jsx                # Navigasi samping dengan hak akses peran
│   │   │   ├── StatCard.jsx               # Kartu ringkasan metrik statistik
│   │   │   ├── DataTable.jsx              # Tabel data dengan pencarian & paginasi
│   │   │   ├── Modal.jsx                  # Dialog modal interaktif
│   │   │   ├── ConfirmDialog.jsx          # Modal konfirmasi tindakan penting
│   │   │   ├── Loading.jsx                # Indikator loading
│   │   │   ├── EmptyState.jsx             # Tampilan data kosong
│   │   │   └── ReceiptModal.jsx           # Struk bukti transaksi (siap cetak/print)
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx        # Shell layout dashboard admin/staff
│   │   ├── pages/
│   │   │   ├── Home.jsx                   # Beranda publik modern (Landing Page)
│   │   │   ├── Login.jsx                  # Halaman masuk & autentikasi
│   │   │   ├── Dashboard.jsx              # Metrik, ringkasan, dan grafik Chart.js
│   │   │   ├── WasteManagement.jsx        # Manajemen jenis sampah & harga beli
│   │   │   ├── Categories.jsx             # Manajemen kategori material daur ulang
│   │   │   ├── Customers.jsx              # Manajemen nasabah (individu/bisnis)
│   │   │   ├── CustomerDetails.jsx        # Detail profil & riwayat transaksi nasabah
│   │   │   ├── Transactions.jsx           # Form kalkulator setor & riwayat transaksi
│   │   │   ├── Reports.jsx                # Laporan pengumpulan, filter & cetak
│   │   │   ├── UserManagement.jsx         # Manajemen akun pengguna & peran (Admin)
│   │   │   └── Settings.jsx               # Identitas instansi & reset data awal (Admin)
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx            # Autentikasi state & hak akses
│   │   ├── services/
│   │   │   └── api.js                     # Klien Axios & konfigurasi endpoint API
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx              # Peta rute aplikasi
│   │   │   └── ProtectedRoute.jsx         # Guard rute terotentikasi & admin
│   │   ├── utils/
│   │   │   └── formatters.js              # Pemformat Rupiah, bobot kg, dan tanggal
│   │   ├── App.jsx                        # Komponen root aplikasi
│   │   └── main.jsx                       # Titik masuk React
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                               # RESTful API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/               # Controller penangan rute HTTP
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── WasteController.php
│   │   │   │   ├── CustomerController.php
│   │   │   │   ├── TransactionController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   ├── UserController.php
│   │   │   │   └── SettingController.php
│   │   │   └── Middleware/
│   │   │       ├── DevelopmentAuthMiddleware.php # Validasi token sesi
│   │   │       └── RoleMiddleware.php            # Proteksi akses peran (Admin/Staff)
│   │   ├── Services/                      # Logika kalkulasi bisnis
│   │   │   ├── AuthService.php
│   │   │   ├── DashboardService.php
│   │   │   ├── WasteService.php
│   │   │   ├── CategoryService.php
│   │   │   ├── CustomerService.php
│   │   │   ├── TransactionService.php
│   │   │   ├── ReportService.php
│   │   │   ├── UserService.php
│   │   │   └── SettingService.php
│   │   └── Repositories/                  # Abstraksi repositori data
│   │       ├── RepositoryInterface.php
│   │       ├── BaseTemporaryRepository.php
│   │       ├── CategoryRepository.php
│   │       ├── WasteRepository.php
│   │       ├── CustomerRepository.php
│   │       ├── TransactionRepository.php
│   │       ├── UserRepository.php
│   │       └── SettingRepository.php
│   ├── routes/
│   │   └── api.php                        # Definisi rute RESTful API
│   ├── composer.json
│   └── .env
│
└── README.md
```

---

## 3. Akun Uji Coba Cepat (Demo Credentials)

Untuk kemudahan pengujian, sistem telah menyediakan akun demo terdaftar:

| Nama Operator | Peran | Email | Kata Sandi | Hak Akses |
|---|---|---|---|---|
| **Radhitya Dhimas Ardyansyah** | **Administrator** | `admin@sampahpay.com` | `password123` | Akses penuh (Dashboard, Sampah, Kategori, Nasabah, Transaksi, Laporan, Manajemen Pengguna, Pengaturan). |
| **Imania Ambarwati** | **Staff Operator / Kasir** | `staff@sampahpay.com` | `password123` | Akses operasional harian (Dashboard, Nasabah, Transaksi Penyetoran, Cetak Struk, Katalog Harga Sampah). |

*(Tombol klik cepat untuk login kedua akun di atas juga tersedia langsung pada halaman `/login`)*.

---

## 4. Cara Menjalankan Aplikasi

Aplikasi dijalankan secara independen menggunakan server pengembangannya masing-masing.

### A. Menjalankan Backend (Laravel)

1. Buka terminal pada folder `backend`:
   ```bash
   cd backend
   ```
2. Jalankan server Laravel:
   ```bash
   php artisan serve --port=8000
   ```
3. Backend akan aktif di: `http://127.0.0.1:8000`

### B. Menjalankan Frontend (React + Vite)

1. Buka terminal baru pada folder `frontend`:
   ```bash
   cd frontend
   ```
2. Jalankan server Vite:
   ```bash
   npm run dev
   ```
3. Buka browser dan akses antarmuka aplikasi di: `http://127.0.0.1:5173`

*(Vite telah dikonfigurasi melakukan proxy otomatis terhadap rute `/api` menuju backend `http://127.0.0.1:8000`)*.

---

## 5. Ringkasan Endpoint RESTful API

| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET` | `/api/status` | Cek status koneksi backend | Publik |
| `POST` | `/api/auth/login` | Autentikasi pengguna | Publik |
| `POST` | `/api/auth/logout` | Keluar dari sesi | Terotentikasi |
| `GET` | `/api/auth/me` | Ambil data profil aktif | Terotentikasi |
| `GET` | `/api/dashboard` | Statistik metrik & data grafik | Terotentikasi |
| `GET` | `/api/waste` | Daftar jenis sampah & harga | Terotentikasi |
| `POST` | `/api/waste` | Tambah jenis sampah baru | Terotentikasi |
| `PUT` | `/api/waste/{id}` | Edit jenis sampah | Terotentikasi |
| `DELETE`| `/api/waste/{id}` | Hapus jenis sampah | Administrator |
| `GET` | `/api/categories` | Daftar kategori material | Terotentikasi |
| `POST` | `/api/categories` | Tambah kategori baru | Terotentikasi |
| `PUT` | `/api/categories/{id}` | Edit kategori | Terotentikasi |
| `DELETE`| `/api/categories/{id}` | Hapus kategori (aman) | Administrator |
| `GET` | `/api/customers` | Daftar nasabah/mitra | Terotentikasi |
| `POST` | `/api/customers` | Pendaftaran nasabah baru | Terotentikasi |
| `GET` | `/api/customers/{id}` | Detail profil & riwayat nasabah | Terotentikasi |
| `PUT` | `/api/customers/{id}` | Update data nasabah | Terotentikasi |
| `DELETE`| `/api/customers/{id}` | Hapus data nasabah | Administrator |
| `GET` | `/api/transactions` | Daftar transaksi penyetoran | Terotentikasi |
| `POST` | `/api/transactions` | Rekam transaksi (kalkulasi otomatis) | Terotentikasi |
| `GET` | `/api/transactions/{id}` | Detail transaksi & data struk | Terotentikasi |
| `DELETE`| `/api/transactions/{id}` | Batalkan transaksi | Administrator |
| `GET` | `/api/reports` | Laporan komprehensif & filter | Terotentikasi |
| `GET` | `/api/users` | Daftar pengguna sistem | Administrator |
| `POST` | `/api/users` | Tambah pengguna baru | Administrator |
| `PUT` | `/api/users/{id}` | Update pengguna / peran | Administrator |
| `DELETE`| `/api/users/{id}` | Hapus akun pengguna | Administrator |
| `GET` | `/api/settings` | Pengaturan instansi & struk | Administrator |
| `PUT` | `/api/settings` | Update pengaturan instansi | Administrator |
| `POST` | `/api/settings/reset` | Reset data sampel ke default | Administrator |

---

## 6. Catatan Data Sementara & Rencana Masa Depan

1. **Batasan Data Sementara (*In-Memory Store*)**:
   - Seluruh data transaksi, pelanggan, jenis sampah, dan pengguna dikelola dalam memori backend dan disinkronkan ke file `backend/storage/app/temporary_store.json`.
   - Data bertahan selama sesi server pengembang aktif dan dapat di-reset kapan saja melalui menu **Pengaturan Sistem** > **Reset Data ke Standar Awal**.

2. **Rencana Integrasi Database Masa Depan**:
   - Berkat implementasi **Repository Pattern** (`RepositoryInterface`), migrasi ke database persisten seperti MySQL atau PostgreSQL di kemudian hari dapat dilakukan secara transparan hanya dengan membuat implementasi repositori baru (misalnya `EloquentWasteRepository`), tanpa mengubah satu baris pun kode pada Controller backend maupun antarmuka React frontend.

