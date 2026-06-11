import { PrismaClient } from '@prisma/client';

export async function createAutoreplies() {
    const prisma = new PrismaClient();

    const dummyAutoreplies = [
        {
            id: "a1",
            name: "Sapaan Customer",
            isActive: true,
            type: "keyword",
            triggerKeyword: "halo, hai, hi, p, kak",
            replyContent:
                "Halo 👋 Selamat datang di Fashion Store kami. Ada yang bisa kami bantu hari ini? Ketik *katalog* untuk melihat koleksi pakaian terbaru.",
        },
        {
            id: "a2",
            name: "Info Pengiriman",
            isActive: true,
            type: "keyword",
            triggerKeyword: "ongkir, pengiriman, kurir, estimasi",
            replyContent:
                "Kami melayani pengiriman ke seluruh Indonesia menggunakan JNE, J&T, SiCepat, dan AnterAja. Estimasi pengiriman 2-7 hari kerja tergantung lokasi tujuan.",
        },
        {
            id: "a3",
            name: "Alamat Toko",
            isActive: true,
            type: "keyword",
            triggerKeyword: "alamat, lokasi, toko, maps",
            replyContent:
                "Toko kami berlokasi di Jl. Fashion No. 10, Jakarta. Untuk pembelian online dapat langsung melalui WhatsApp ini.",
        },
        {
            id: "a4",
            name: "Metode Pembayaran",
            isActive: true,
            type: "keyword",
            triggerKeyword: "bayar, transfer, pembayaran, rekening, qris",
            replyContent:
                "Kami menerima pembayaran melalui Transfer Bank, QRIS, Dana, OVO, dan GoPay. Setelah pembayaran silakan kirim bukti transfer ke chat ini.",
        },
        {
            id: "a5",
            name: "Cara Pemesanan",
            isActive: true,
            type: "keyword",
            triggerKeyword: "pesan, order, beli, checkout",
            replyContent:
                "Untuk melakukan pemesanan, silakan kirim nama produk, ukuran, warna, dan jumlah yang ingin dibeli. Admin akan membantu proses checkout.",
        },
        {
            id: "a6",
            name: "Status Pesanan",
            isActive: true,
            type: "keyword",
            triggerKeyword: "status pesanan, resi, tracking, lacak",
            replyContent:
                "Silakan kirim nomor pesanan Anda. Admin akan membantu mengecek status pesanan dan nomor resi pengiriman.",
        },
        {
            id: "a7",
            name: "Media Sosial",
            isActive: true,
            type: "keyword",
            triggerKeyword: "instagram, ig, tiktok, sosial media",
            replyContent:
                "Ikuti koleksi terbaru kami di:\n📸 Instagram: @fashionstore.id\n🎵 TikTok: @fashionstore.id",
        },

        // ==========================
        // AI AGENT
        // ==========================
        {
            id: "ai1",
            name: "AI Agent - Fashion Consultant",
            isActive: true,
            type: "ai_rag",
            aiPrompt: `
Anda adalah fashion consultant profesional.

Tugas Anda:
- Membantu pelanggan memilih pakaian yang sesuai.
- Memberikan rekomendasi berdasarkan gender, ukuran, warna favorit, budget, dan kebutuhan acara.
- Gunakan data produk dari knowledge base yang tersedia.
- Jika menemukan produk yang sesuai tampilkan:
  • Nama Produk
  • Harga
  • Stok
  • Deskripsi Singkat
- Berikan maksimal 5 rekomendasi produk terbaik.
- Gunakan bahasa yang ramah dan persuasif.
`,
        },
        {
            id: "ai2",
            name: "AI Agent - Customer Service Fashion",
            isActive: true,
            type: "ai_rag",
            aiPrompt: `
Anda adalah customer service toko pakaian online.

Bantu pelanggan terkait:
- Status pesanan
- Pengiriman
- Pembayaran
- Retur barang
- Penukaran ukuran
- Ketersediaan stok

Jawab dengan ramah, profesional, dan mudah dipahami.
`,
        },
        {
            id: "f1",
            name: "Katalog Produk",
            isActive: true,
            type: "keyword",
            triggerKeyword: "katalog, produk, koleksi, pakaian",
            replyContent:
                "Berikut katalog produk pakaian terbaru kami.",
            fileName: "Katalog_Pakaian_2026.pdf",
            fileUrl: "https://example.com/catalog-fashion.pdf",
            mimeType: "application/pdf",
        },
        {
            id: "f2",
            name: "Panduan Ukuran",
            isActive: true,
            type: "keyword",
            triggerKeyword: "size, ukuran, size chart",
            replyContent:
                "Berikut panduan ukuran pakaian kami agar Anda dapat memilih size yang sesuai.",
            fileName: "size-chart.png",
            fileUrl: "https://example.com/size-chart.png",
            mimeType: "image/png",
        },
        {
            id: "f3",
            name: "Promo Fashion",
            isActive: true,
            type: "keyword",
            triggerKeyword: "promo, diskon, sale, voucher",
            replyContent:
                "🔥 Promo Fashion Week!\nGunakan kode voucher *FASHION20* untuk mendapatkan diskon 20% untuk seluruh produk pilihan.",
        },

        // ==========================
        // FALLBACK
        // ==========================
        {
            id: "fb1",
            name: "Fallback Utama",
            isActive: true,
            type: "fallback",
            replyContent:
                "Maaf, kami belum memahami pesan Anda. 🤖\nSilakan tanyakan mengenai produk, ukuran, stok, pembayaran, atau pengiriman. Jika diperlukan, pesan Anda akan diteruskan ke admin.",
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