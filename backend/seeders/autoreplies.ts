import { PrismaClient } from '@prisma/client';

export async function createAutoreplies() {
    const prisma = new PrismaClient();

    const dummyAutoreplies = [
        // =================================================================
        // CATEGORY 1: KEYWORD TRIGGERS (Statis)
        // =================================================================
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
            name: "Sapaan Halo / P",
            isActive: true,
            type: "keyword",
            triggerKeyword: "halo, p, hi, selamat pagi, selamat siang, siang, pagi, sore, malam",
            replyContent: "Halo! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu hari ini? Silakan ketik *Menu* untuk melihat opsi layanan.",
        },
        {
            id: "a4b6c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
            name: "Info Jam Operasional",
            isActive: true,
            type: "keyword",
            triggerKeyword: "jam buka, jam kerja, operasional, jadwal, buka jam berapa",
            replyContent: "Kantor kami buka setiap hari Senin - Jumat pukul 08.00 - 17.00 WIB. Untuk hari Sabtu, Minggu, dan Libur Nasional kami tutup.",
        },
        {
            id: "a3b2c3d0-e5f6-4a8b-9c0d-1e2f3a4b5c6d",
            name: "Alamat Kantor & Lokasi",
            isActive: true,
            type: "keyword",
            triggerKeyword: "alamat, lokasi, kantor, posisi, shareloc, map",
            replyContent: "Kantor utama kami beralamat di Gedung Tech Tower Lt. 5, Jl. Sudirman No. 21, Jakarta Selatan. Link Google Maps: https://maps.google.com/contoh",
        },
        {
            id: "a1b2c3d5-e5f6-4a8b-9c0d-1e2f3a4b5c6d",
            name: "Metode Pembayaran",
            isActive: true,
            type: "keyword",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            triggerKeyword: "bayar, transfer, rekening, pembayaran, bank, bca",
            replyContent: "Kami menerima pembayaran via Transfer Bank:\n- BCA: 1234567890 a/n PT Maju Jaya\n- Mandiri: 0987654321 a/n PT Maju Jaya\n\nMohon kirimkan bukti transfer ke chat ini setelah melakukan pembayaran.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e8f3a4b5c6d",
            name: "Komplain Kendala Sistem",
            isActive: true,
            type: "keyword",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            triggerKeyword: "komplain, rusak, error, tidak bisa, gangguan, lambat",
            replyContent: "Mohon maaf atas ketidaknyamanannya. Keluhan Anda telah kami catat. Mohon kirimkan email akun Anda dan screenshot kendala agar tim teknis kami bisa langsung mengeceknya.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f8a4b4c9d",
            name: "Cara Berlangganan",
            isActive: true,
            type: "keyword",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            triggerKeyword: "cara daftar, langganan, subscribe, join",
            replyContent: "Untuk mulai berlangganan, Anda bisa mendaftar langsung melalui website resmi kami di https://example.com/register atau ketik *Price List* untuk melihat paket yang tersedia.",
        },
        {
            id: "a1b2c3d4-e5f9-7a8b-9c0d-1e2f3a4b5c6d",
            name: "Social Media Info",
            isActive: true,
            type: "keyword",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            triggerKeyword: "ig, instagram, sosmed, sosial media, tiktok",
            replyContent: "Yuk ikuti keseruan kami dan dapatkan promo menarik di media sosial resmi kami:\n- Instagram: @majujeh_tech\n- TikTok: @majutech_official",
        },

        // =================================================================
        // CATEGORY 2: AI RAG TRIGGERS (Smart Bot)
        // =================================================================
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e5f3a4b5c6d",
            name: "AI Agent - Konsultasi Produk",
            isActive: true,
            type: "ai_rag",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            aiPrompt: "Anda adalah agen penjualan senior yang ramah. Tugas Anda adalah membantu calon pembeli memilih paket software yang sesuai dengan skala bisnis mereka (UMKM, Enterprise, atau Retail). Selalu tawarkan solusi dengan sopan dan gunakan emoji sewajarnya.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a5b9c6d",
            name: "AI Agent - Tech Support Tingkat 1",
            isActive: true,
            type: "ai_rag",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            aiPrompt: "Anda adalah tim IT Support Khusus Aplikasi SaaS. Bantu user melakukan troubleshooting masalah login, reset password, dan sinkronisasi data database berdasarkan knowledge base yang tersedia. Jawab dengan langkah demi langkah yang clear.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-7c0d-1e7f3a4b5c6d",
            name: "AI Agent - HRD FAQ",
            isActive: false, // Contoh aturan non-aktif
            type: "ai_rag",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            aiPrompt: "Anda adalah asisten HRD internal perusahaan. Jawab pertanyaan karyawan mengenai aturan cuti, klaim asuransi kesehatan, dan reimbursement sesuai dengan buku panduan karyawan. Gunakan bahasa yang profesional namun tetap kasual.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e6f4a4b5c6d",
            name: "AI Agent - Rekomendasi Kuliner (Bot Resto)",
            isActive: true,
            type: "ai_rag",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            aiPrompt: "Anda adalah asisten virtual restoran 'Rasa Nusantara'. Tugas Anda merekomendasikan menu makanan berdasarkan preferensi tingkat kepedasan, alergi, atau budget customer. Selalu sebutkan menu best seller kami: Ayam Bakar Madu.",
        },
        {
            id: "a1b2c3d4-e8f1-7a8b-9c0d-1e2f3a4b5c6d",
            name: "AI Agent - Edukasi Keuangan / Finansial",
            isActive: true,
            type: "ai_rag",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf",
            aiPrompt: "Anda adalah perencana keuangan AI. Berikan tips dasar finansial mengenai investasi, dana darurat, dan manajemen utang secara bijak. Disclaimer: selalu ingatkan user bahwa ini adalah saran umum dan bukan nasihat hukum/keuangan mutlak.",
        },

        // =================================================================
        // CATEGORY 3: KEYWORD WITH MEDIA ATTACHMENTS (Gambar / PDF)
        // =================================================================
        {
            id: "a1b2c3d4-e5f6-5a9b-1c0d-1e2f3a4b5c6d",
            name: "Price List PDF Send",
            isActive: true,
            type: "keyword",
            triggerKeyword: "harga, pricelist, harga paket, biaya",
            replyContent: "Berikut adalah daftar harga paket layanan kami terbaru tahun ini. Silakan cek file PDF di bawah ini.",
            fileName: "Price_List_2026.pdf",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/price_list_2026.pdf",
            mimeType: "application/pdf"
        },
        {
            id: "a1b2c3d4-e5f6-1a1b-1c0d-1e2f3a4b5c6d",
            name: "Brosur Perumahan (Gambar)",
            isActive: true,
            type: "keyword",
            triggerKeyword: "brosur, foto rumah, tipe rumah, cluster",
            replyContent: "Ini adalah brosur Cluster Green Residence tipe 36 dan 45. Rumah siap huni dengan cicilan mulai 2 jutaan!",
            fileName: "brosur-green-residence.png",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/images/brosur_green.png",
            mimeType: "image/png"
        },
        {
            id: "a1b2c3d4-e5f6-4a5b-9c0d-1e2f3a4b5c6d",
            name: "Kirim Formulir Pendaftaran (Docx)",
            isActive: true,
            type: "keyword",
            triggerKeyword: "form, formulir, berkas pendaftaran",
            replyContent: "Silakan unduh, isi, dan lengkapi formulir pendaftaran berikut ini, lalu kirim kembali ke tim admin.",
            fileName: "Form_Pendaftaran_Siswa.docx",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/docs/form_pendaftaran.docx",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        },
        {
            id: "a1b2c3d4-e5f6-3a5b-9c0d-1e2f3a4b5c6d",
            name: "Audio Petunjuk Penggunaan",
            isActive: true,
            type: "keyword",
            triggerKeyword: "voice note, cara pakai, panduan suara",
            replyContent: "Dengarkan panduan suara berikut untuk cara mengaktifkan perangkat Anda:",
            fileName: "panduan_aktivasi.mp3",
            fileUrl: "https://storage.googleapis.com/cdn-bucket/audio/panduan_aktivasi.mp3",
            mimeType: "audio/mpeg"
        },

        // =================================================================
        // CATEGORY 4: FALLBACK TRIGGERS (Jika tidak ada keyword yang cocok)
        // =================================================================
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-3e5f3a4b5c6d",
            name: "Fallback Utama - Alihkan ke CS",
            isActive: true,
            type: "fallback",
            replyContent: "Maaf, sistem kami belum memahami pesan Anda. 🤖\nPesan Anda saat ini sedang dialihkan ke Customer Service manusia. Mohon tunggu sebentar ya.",
        },
        {
            id: "a1b2c3d4-e3f9-7a8b-9c0d-1e2f3a4b5c6d",
            name: "Fallback Alternatif - Malam Hari",
            isActive: false, // Dicadangkan / tidak aktif
            type: "fallback",
            replyContent: "Halo, karena sekarang di luar jam kerja, bot tidak dapat memproses pesan khusus ini. Tim kami akan membalas pesan Anda secara manual besok pagi ya!",
        },

        // =================================================================
        // CATEGORY 5: KEYWORD SPESIFIK PROMO / EVENT
        // =================================================================
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b8c8d",
            name: "Promo Ramadhan/Hari Raya",
            isActive: true,
            type: "keyword",
            triggerKeyword: "promo, diskon, potongan, sale, voucher",
            replyContent: "Gunakan kode voucher *PROMO2026* saat checkout untuk mendapatkan diskon sebesar 20% tanpa minimum pembelian! Berlaku hingga akhir bulan ini.",
        },
        {
            id: "a1b2c3d4-e5f6-7a8b-9c0d-5e5f3a5b5c6d",
            name: "Link Webinar / Event",
            isActive: true,
            type: "keyword",
            triggerKeyword: "webinar, zoom, link, ikuti event",
            replyContent: "Terima kasih sudah mendaftar webinar! Berikut adalah link ruang Zoom: https://zoom.us/j/999888777 (Passcode: MAJU2026). Room dibuka 15 menit sebelum acara.",
        },
    ];

    try {
        console.log('Sedang memasukkan data dummy autoreply...');
        const result = await prisma.autoreply.createMany({
            data: dummyAutoreplies,
            skipDuplicates: true,
        });

        console.log(`✅ Berhasil memasukkan ${result.count} data dummy autoreply.`);
    } catch (error) {
        console.error('❌ Gagal memasukkan data dummy:', error);
    } finally {
        await prisma.$disconnect();
    }
}