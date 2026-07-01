import { Injectable, OnModuleInit } from "@nestjs/common";
import { Ollama } from "ollama";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import { RAM_CACHE_MODELS } from "../constants/constatns-models";



interface HistoryChatbot {
    id: string;
    chat: Content[];
}

interface GoogleAPIError {
    code?: number;
    status?: string;
    message?: string;
}


@Injectable()
export class AIService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private historyChatbot: HistoryChatbot[] = [];
    //private ollama = new Ollama({ host: process.env.BASE_URL_OLLAMA || "http://127.0.0.1:11434" });
    private models: string[] = [];
    private modelsEmbedding: string[] = [];

    constructor() { }

    onModuleInit() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.fetchModels();
    }

    fetchModels() {
        const models = [
            process.env.MODEL_PRIMARY || "gemini-2.5-flash-lite",
            process.env.MODEL_SECONDARY!,
            process.env.MODEL_TERTIARY!,
            "gemma-4-26b-a4b-it",
            "gemma-4-31b-it",
        ]
        const modelEmbeddings = [
            process.env.MODEL_EMBEDDING_PRIMARY || "bge-m3",
            process.env.MODEL_EMBEDDING_SECONDARY || "gemini-embedding-001",
            process.env.MODEL_EMBEDDING_TERTIARY!
        ];
        this.models = models;
        this.modelsEmbedding = modelEmbeddings;
        for (const item of models) {
            RAM_CACHE_MODELS[item] = {
                limitPerDay: 20,
                usedToken: 20,
                active: true,
                lastUsed: new Date(),
                whenUpdate: new Date()
            }
        }
        for (const item of modelEmbeddings) {
            RAM_CACHE_MODELS[item] = {
                limitPerDay: 20,
                usedToken: 20,
                active: true,
                lastUsed: new Date(),
                whenUpdate: new Date()
            }
        }
    }

    async embeddings(text: string) {
        // const response = await this.ollama.embeddings({
        //     model: 'bge-m3',
        //     prompt: text,
        // });

        // const embedding = response.embedding;
        // return embedding;
        for (const modelName of this.modelsEmbedding) {
            try {
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const result = await model.embedContent({
                    content: {
                        parts: [{ text: text }]
                    },
                    outputDimensionality: 1024,
                } as any);

                const embedding = result.embedding;
                return embedding.values;
            } catch (err) {
                console.error(`Gagal mendapatkan embedding dari model ${modelName}:`, err);
            }
        }
        throw new Error("Gagal mendapatkan embedding dari semua model yang tersedia.");
    }

    isGoogleError(err: any): err is GoogleAPIError {
        return err && typeof err === 'object' && ('code' in err || 'status' in err);
    }

    async embeddingsGemini(text: string) {
        for (const m of this.modelsEmbedding) {
            const findModel = RAM_CACHE_MODELS[m];
            try {
                if (!findModel.active) {
                    const now = new Date();
                    const dateUpdate = new Date(findModel.whenUpdate);
                    if (now.getTime() < dateUpdate.getTime()) continue;
                    findModel.whenUpdate = new Date(now.getTime() + (2 * 60 * 1000));
                    findModel.active = true;
                }
                const model = this.genAI.getGenerativeModel({ model: m });
                const result = await model.embedContent({
                    content: {
                        parts: [{ text: text }]
                    },
                    outputDimensionality: 1024,
                } as any);

                const embedding = result.embedding;
                return embedding.values;
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);
                if (findModel) {
                    const now = new Date();
                    if (this.isGoogleError(err)) {
                        if (err.code === 429 || err.status === 'RESOURCE_EXHAUSTED') {
                            console.warn(`Model ${m} mencapai batas kuota (Rate Limit).`);
                            findModel.limitPerDay = 0;
                        }
                    }

                    findModel.active = false;
                    findModel.whenUpdate = new Date(now.getTime() + (3 * 60 * 1000));
                    findModel.lastUsed = now;
                }
            } finally {
                RAM_CACHE_MODELS[m] = findModel;
            }
        }
        throw new Error("Gagal mendapatkan embedding dari semua model yang tersedia.");
    }

    async chatbot(id: string, prompt: string, systemRules: string) {
        // const response = await ollama.chat({
        //     model: 'gemma3:1b',
        //     messages: [{ role: 'user', content: prompt }],
        //     stream: false
        // });
        // return response.message.content;
        const history = this.historyChatbot.find(h => h.id === id);
        for (const m of this.models) {
            const findModel = RAM_CACHE_MODELS[m];
            try {
                if (!findModel.active) {
                    const now = new Date();
                    const dateUpdate = new Date(findModel.whenUpdate);
                    if (now.getTime() < dateUpdate.getTime()) continue;
                    findModel.whenUpdate = new Date(now.getTime() + (2 * 60 * 1000));
                    findModel.active = true;
                }
                const model = this.genAI.getGenerativeModel({
                    model: m
                });
                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{
                                text: `${systemRules} \nformat output: 
                            Sebelum jawaban yang akan dibaca warga, WAJIB tulis:
                            ===JAWABAN===
                            Setelah itu baru berikan jawaban.
                            Apabila perlu mengirim JSON, letakkan JSON di bagian PALING AKHIR.` }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Baik, saya mengerti." }],
                        },
                        ...(history?.chat || [])
                    ]
                })
                const result = await chat.sendMessage(prompt);
                const text = result.response.text();
                const cleanedText = (text.split('===JAWABAN===').pop() || text).trim();
                if (!history) {
                    this.historyChatbot.push({
                        id: id, chat: [
                            { role: "user", parts: [{ text: prompt }] },
                            { role: "model", parts: [{ text: cleanedText }] }
                        ]
                    });
                } else {
                    history.chat.push({ role: "user", parts: [{ text: prompt }] });
                    history.chat.push({ role: "model", parts: [{ text: cleanedText }] });

                    const MAX_HISTORY = 10;
                    if (history.chat.length > MAX_HISTORY) {
                        history.chat.splice(0, history.chat.length - MAX_HISTORY);
                    }
                }
                findModel.usedToken = findModel.usedToken + 1;
                return cleanedText;
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);

                if (findModel) {
                    const now = new Date();
                    let cooldownTime = 3 * 60 * 1000;

                    if (this.isGoogleError(err)) {
                        const googleErr = (err as any)?.response?.data?.error || err;
                        const isRateLimit = googleErr.code === 429 || googleErr.status === 'RESOURCE_EXHAUSTED';

                        if (isRateLimit) {
                            console.warn(`Model ${m} mencapai batas kuota (Rate Limit).`);
                            const quotaLimit = googleErr.details?.[0]?.metadata?.quota_limit || "";
                            if (quotaLimit.includes("Day") || googleErr.message?.includes("per day")) {
                                console.error(`→ Model ${m} terkena limit harian (RPD). Dimatikan sampai besok.`);
                                findModel.limitPerDay = 0;

                                const midnight = new Date();
                                midnight.setHours(24, 1, 0, 0); // 24 jam dari hari ini berarti jam 00:01 esok hari
                                cooldownTime = midnight.getTime() - now.getTime();
                            } else {
                                console.warn(`→ Model ${m} terkena limit per menit (RPM). Silakan coba sesaat lagi.`);
                                cooldownTime = 2 * 60 * 1000;
                            }
                        }
                    }

                    // Terapkan status dan waktu pembaruan
                    findModel.active = false;
                    findModel.whenUpdate = new Date(now.getTime() + cooldownTime);
                    findModel.lastUsed = now;

                    console.log(`[System] Model ${m} di-nonaktifkan. Akan aktif kembali pada: ${findModel.whenUpdate.toLocaleString('id-ID')}`);
                }
            } finally {
                RAM_CACHE_MODELS[m] = findModel;
            }
        }
        throw new Error("Gagal mendapatkan jawaban dari semua model yang tersedia.");
    }

    async reWrite(id: string, message: string): Promise<string> {
        const history = this.historyChatbot.find(h => h.id === id);
        for (const m of this.models) {
            const findModel = RAM_CACHE_MODELS[m];
            try {
                if (!findModel.active) {
                    const now = new Date();
                    const dateUpdate = new Date(findModel.whenUpdate);
                    if (now.getTime() < dateUpdate.getTime()) continue;
                    findModel.whenUpdate = new Date(now.getTime() + (2 * 60 * 1000));
                    findModel.active = true;
                }
                const model = this.genAI.getGenerativeModel({ model: m });
                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{
                                text: `Tugas kamu adalah menulis ulang (rewrite) pesan dari calon pelanggan menjadi kueri pencarian dokumen (RAG) yang optimal.

                                Aturan ketat yang harus dipatuhi:
                                1. Normalisasikan singkatan tidak baku atau bahasa gaul menjadi kata baku (contoh: "yg" -> "yang", "blm" -> "belum", "dftr" -> "daftar").
                                2. Hilangkan semua kata basa-basi (halo, permisi, min), emosi, tanda seru, atau sapaan.
                                3. Ekstrak inti masalah menjadi satu pernyataan atau kalimat tanya yang padat informasi, serta mengandung kata kunci administratif/formal yang relevan.
                                4. KHUSUS jika pelanggan berniat membeli/memesan, HANYA cantumkan nama produknya saja.
                                5. PENTING: Langsung berikan hasil rewrite tanpa ada teks pengantar (seperti "Berikut hasilnya:"), tanpa tanda kutip, dan tanpa penjelasan apa pun.
                                format output: 
                                Sebelum jawaban yang akan dibaca warga, WAJIB tulis:
                                ===JAWABAN===
                                Setelah itu baru berikan jawaban.
                                Apabila perlu mengirim JSON, letakkan JSON di bagian PALING AKHIR.`
                            }],
                        },
                        {
                            role: "model",
                            parts: [{
                                text: "Saya mengerti. Saya akan mengekstrak kata kunci dan informasi administratif penting dari pesan warga untuk pencarian dokumen."
                            }],
                        },
                        ...(history?.chat || [])
                    ],
                });
                const result = await chat.sendMessage(`Ekstrak kata kunci pencarian dari pesan ini: "${message}"`);
                const text = await result.response.text();
                const cleanedText = (text.split('===JAWABAN===').pop() || text).trim();

                console.log(`Original: ${message} | Optimized for Embedding: ${cleanedText}`);

                return cleanedText || message;
            } catch (err: unknown) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);

                if (findModel) {
                    const now = new Date();
                    let cooldownTime = 3 * 60 * 1000;

                    if (this.isGoogleError(err)) {
                        const googleErr = (err as any)?.response?.data?.error || err;
                        const isRateLimit = googleErr.code === 429 || googleErr.status === 'RESOURCE_EXHAUSTED';

                        if (isRateLimit) {
                            console.warn(`Model ${m} mencapai batas kuota (Rate Limit).`);
                            const quotaLimit = googleErr.details?.[0]?.metadata?.quota_limit || "";
                            if (quotaLimit.includes("Day") || googleErr.message?.includes("per day")) {
                                console.error(`→ Model ${m} terkena limit harian (RPD). Dimatikan sampai besok.`);
                                findModel.limitPerDay = 0;

                                const midnight = new Date();
                                midnight.setHours(24, 1, 0, 0); // 24 jam dari hari ini berarti jam 00:01 esok hari
                                cooldownTime = midnight.getTime() - now.getTime();
                            } else {
                                console.warn(`→ Model ${m} terkena limit per menit (RPM). Silakan coba sesaat lagi.`);
                                cooldownTime = 2 * 60 * 1000;
                            }
                        }
                    }

                    // Terapkan status dan waktu pembaruan
                    findModel.active = false;
                    findModel.whenUpdate = new Date(now.getTime() + cooldownTime);
                    findModel.lastUsed = now;

                    console.log(`[System] Model ${m} di-nonaktifkan. Akan aktif kembali pada: ${findModel.whenUpdate.toLocaleString('id-ID')}`);
                }
            } finally {
                RAM_CACHE_MODELS[m] = findModel;
            }
        }
        throw new Error("Gagal melakukan reWrite dengan semua model yang tersedia.");
    }
}