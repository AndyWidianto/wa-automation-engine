# 🌟 Vogue Hub

> **Vogue Hub** adalah platform chatbot cerdas berbasis *Full-Stack* yang dirancang untuk mengotomatisasi proses pemesanan secara interaktif dan *real-time*. Proyek ini mengintegrasikan teknologi *backend* yang andal dengan antarmuka pengguna yang modern, serta memanfaatkan *WhatsApp API* untuk kemudahan interaksi pengguna.

---

## 🚀 Tech Stack

Proyek ini dibangun menggunakan teknologi modern pilihan standar industri:

### **Frontend & UI**
* **React.js** (Vite / Webview) - Pustaka antarmuka pengguna yang cepat dan reaktif.
* **Tailwind CSS** - *Utility-first CSS framework* untuk desain UI yang responsif dan elegan.
* **Zustand** - Manajemen state global yang ringan dan efisien.

### **Backend & API**
* **TypeScript** - Memastikan keamanan tipe data (*type safety*) di seluruh lapisan aplikasi.
* **NestJS** - Kerangka kerja *backend* Node.js yang modular, terstruktur, dan scalable.
* **Evolution API** - Gerbang integrasi WhatsApp *gateway* untuk otomatisasi pesan dan chatbot.

### **Database & Storage**
* **PostgreSQL** - Basis data relasional yang handal untuk mengelola data transaksi pemesanan dan pengguna.

---

## 📂 Struktur Proyek (Arsitektur Singkat)

```text
vogue-hub/
├── backend/                    # Backend (NestJS)
├── frontend/
└── README.md
```

# ⚙️ Memulai (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di komputer Anda.
Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut di sistem Anda:
- Node.js (Versi LTS disarankan)
- PostgreSQL
- Git

1. Clone Repository
```bash
git clone https://github.com/AndyWidianto/wa-automation-engine.git
cd wa-automation-engine
```

2. Instalasi Dependensi
Install dependensi untuk backend dan frontend:
```bash
cd backend
npm install

cd frontend
npm install
```

3. Konfigurasi Environment Variables

Buat file .env di direktori root proyek dengan menduplikasi dari contoh yang ada, lalu sesuaikan isinya:
```bash
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/vogue_hub_db"
BASE_URL_CLIENT="http://localhost:5173"
EVOLUTION_API_KEY="your_evolution_api_key_here"
EVOLUTION_API_URL="your_evolution_api_endpoint_here"
```

4. Menjalankan Aplikasi

Menjalankan Backend (NestJS):
```bash
cd backend
npm run start:dev
```

Menjalankan Frontend (React):
```bash
cd frontend
npm run dev
```


# 🛠️ Fitur Utama

🤖 AI Chatbot Interaktif: Menangani alur pemesanan otomatis dengan pemahaman konteks yang baik.
🛒 Sistem Pemesanan Real-time: Pencatatan transaksi pesanan secara instan ke database PostgreSQL.
📱 Integrasi WhatsApp: Terhubung langsung via Evolution API untuk mengirim dan menerima pesan WhatsApp secara otomatis.
⚡ State Management Modern: Pengelolaan state aplikasi frontend yang cepat menggunakan Zustand.

# 📜 Lisensi

Proyek ini bersifat pribadi/open-source di bawah lisensi MIT.