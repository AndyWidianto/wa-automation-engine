import { Injectable, OnModuleInit } from "@nestjs/common";
import { Ollama } from "ollama";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";



interface HistoryChatbot {
    id: string;
    chat: Content[];
}

@Injectable()
export class AIService implements OnModuleInit {
    private genAI: GoogleGenerativeAI;
    private historyChatbot: HistoryChatbot[] = [];
    private ollama = new Ollama({ host: process.env.BASE_URL_OLLAMA || "http://127.0.0.1:11434" });
    private models: string[] = [];
    private modelsEmbedding: string[] = [];

    constructor() { }

    onModuleInit() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        this.fetchModels();
    }

    fetchModels() {
        this.models = [
            process.env.MODEL_PRIMARY || "gemini-2.5-flash-lite",
            process.env.MODEL_SECONDARY!,
            process.env.MODEL_TERTIARY!,
            "gemma-4-26b-a4b-it",
            "gemma-4-31b-it",
        ];
        this.modelsEmbedding = [
            process.env.MODEL_EMBEDDING_PRIMARY || "bge-m3",
            process.env.MODEL_EMBEDDING_SECONDARY || "gemini-embedding-001",
            process.env.MODEL_EMBEDDING_TERTIARY!
        ];
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

    async embeddingsGemini(text: string) {
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

    async chatbot(id: string, prompt: string, systemRules: string) {
        // const response = await ollama.chat({
        //     model: 'gemma3:1b',
        //     messages: [{ role: 'user', content: prompt }],
        //     stream: false
        // });
        // return response.message.content;
        const history = this.historyChatbot.find(h => h.id === id);
        for (const m of this.models) {
            try {
                const model = this.genAI.getGenerativeModel({
                    model: m
                });
                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemRules }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Baik, saya mengerti." }],
                        },
                        ...(history?.chat || [])
                    ]
                })
                const result = await chat.sendMessage(prompt);
                const response = await result.response;
                const text = response.text();
                if (!history) {
                    this.historyChatbot.push({
                        id: id, chat: [
                            { role: "user", parts: [{ text: prompt }] },
                            { role: "model", parts: [{ text: text }] }
                        ]
                    });
                } else {
                    history.chat.push({ role: "user", parts: [{ text: prompt }] });
                    history.chat.push({ role: "model", parts: [{ text: text }] });

                    const MAX_HISTORY = 10;
                    if (history.chat.length > MAX_HISTORY) {
                        history.chat.splice(0, history.chat.length - MAX_HISTORY);
                    }
                }
                return text;
            } catch (err) {
                console.error(`Gagal mendapatkan jawaban dari model ${m}:`, err);
            }
        }
        throw new Error("Gagal mendapatkan jawaban dari semua model yang tersedia.");
    }

    async reWrite(id: string, message: string): Promise<string> {
        const history = this.historyChatbot.find(h => h.id === id);
        for (const m of this.models) {
            try {
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
                                5. PENTING: Langsung berikan hasil rewrite tanpa ada teks pengantar (seperti "Berikut hasilnya:"), tanpa tanda kutip, dan tanpa penjelasan apa pun.`
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
                const response = await result.response;
                const optimizedQuery = response.text().trim();

                console.log(`Original: ${message} | Optimized for Embedding: ${optimizedQuery}`);

                return optimizedQuery || message;
            } catch (err) {
                console.error(`Gagal melakukan reWrite dengan model ${m}:`, err);
            }
        }
        throw new Error("Gagal melakukan reWrite dengan semua model yang tersedia.");
    }
}