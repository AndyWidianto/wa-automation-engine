type FeatureType = 'autoreply' | 'knowledge' | 'product' | 'device';
type ActionType = 'create' | 'update' | 'delete';

export const notificationTemplates: Record<FeatureType, Record<ActionType, { title: string; getContent: (name: string) => string }>> = {
    autoreply: {
        create: { title: "Auto Reply Ditambahkan", getContent: (name) => `Pemicu Auto Reply baru "${name}" berhasil dibuat.` },
        update: { title: "Auto Reply Diperbarui", getContent: (name) => `Pengaturan Auto Reply "${name}" telah berhasil diubah.` },
        delete: { title: "Auto Reply Dihapus", getContent: (name) => `Auto Reply "${name}" telah dihapus dari sistem.` }
    },
    knowledge: {
        create: { title: "Knowledge Base Ditambahkan", getContent: (name) => `Data Knowledge Base baru "${name}" berhasil disimpan.` },
        update: { title: "Knowledge Base Diperbarui", getContent: (name) => `Informasi pada Knowledge Base "${name}" telah diperbarui.` },
        delete: { title: "Knowledge Base Dihapus", getContent: (name) => `Knowledge Base "${name}" telah dihapus.` }
    },
    product: {
        create: { title: "Produk Baru Ditambahkan", getContent: (name) => `Produk "${name}" berhasil didaftarkan ke katalog.` },
        update: { title: "Informasi Produk Diperbarui", getContent: (name) => `Detail produk "${name}" telah berhasil diperbarui.` },
        delete: { title: "Produk Dihapus", getContent: (name) => `Produk "${name}" telah dihapus dari katalog.` }
    },
    device: {
        create: {
            title: "Instance Baru Ditambahkan",
            getContent: (name) => `Instance WhatsApp "${name}" berhasil didaftarkan ke sistem.`
        },
        update: {
            title: "Instance Diperbarui",
            getContent: (name) => `Konfigurasi atau status untuk Instance "${name}" telah berhasil diperbarui.`
        },
        delete: {
            title: "Instance Dihapus",
            getContent: (name) => `Instance "${name}" beserta seluruh datanya telah dihapus dari sistem.`
        }
    }
};