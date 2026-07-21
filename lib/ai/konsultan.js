/**
 * ─────────────────────────────────────────────────────────────────────────────
 * lib/ai/konsultan.js — Pemanggil LLM untuk AI Konsultan Petani (FIX TUGAS 2)
 *
 * Brief meminta "Gemini atau OpenAI" — modul ini mendukung KEDUANYA lewat
 * `fetch` mentah ke REST API resmi masing-masing (tanpa SDK tambahan, supaya
 * tidak menambah dependency yang belum terverifikasi tersedia di lingkungan
 * Anda — pelajaran dari insiden versi ikon `lucide-react` sebelumnya).
 *
 * Provider dipilih otomatis dari env:
 *   - GEMINI_API_KEY terisi → pakai Gemini (diprioritaskan)
 *   - else jika OPENAI_API_KEY terisi → pakai OpenAI
 *   - else → melempar Error yang jelas (BUKAN diam-diam balik ke mock)
 *
 * Endpoint diverifikasi manual sebelum ditulis:
 *   Gemini : POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 *            header x-goog-api-key, body { contents: [{ role, parts: [{text}] }] }
 *   OpenAI : POST https://api.openai.com/v1/chat/completions
 *            header Authorization: Bearer, body { model, messages: [{role,content}] }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SYSTEM_PROMPT = `Anda adalah AI Konsultan TaniPro — asisten bisnis untuk petani B2B di Indonesia.
Beri saran singkat, praktis, dan berbasis konteks agrilogistik (harga pasar, cuaca, hama/penyakit
tanaman, dan strategi penjualan/pembeli). Jawab dalam Bahasa Indonesia, maksimal 4-5 kalimat,
nada suportif seperti berbicara dengan sesama petani, hindari jargon berlebihan.`;

/** Deteksi provider aktif dari environment variable. */
function resolveProvider() {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

async function callGemini(pertanyaan, topik) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${SYSTEM_PROMPT}\n\nTopik: ${topik}\nPertanyaan petani: ${pertanyaan}` }],
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const pesan = data?.error?.message || `Gemini API error (HTTP ${res.status})`;
    throw new Error(pesan);
  }

  const jawaban = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!jawaban) throw new Error("Gemini tidak mengembalikan jawaban (kemungkinan diblokir safety filter).");

  return { jawaban: jawaban.trim(), modelAI: model, tokenUsed: data?.usageMetadata?.totalTokenCount ?? null };
}

async function callOpenAI(pertanyaan, topik) {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Topik: ${topik}\nPertanyaan petani: ${pertanyaan}` },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const pesan = data?.error?.message || `OpenAI API error (HTTP ${res.status})`;
    throw new Error(pesan);
  }

  const jawaban = data?.choices?.[0]?.message?.content;
  if (!jawaban) throw new Error("OpenAI tidak mengembalikan jawaban.");

  return { jawaban: jawaban.trim(), modelAI: model, tokenUsed: data?.usage?.total_tokens ?? null };
}

/**
 * Panggil LLM aktif (Gemini/OpenAI) dan kembalikan jawaban.
 * @param {string} pertanyaan
 * @param {string} topik  — "harga" | "cuaca" | "hama" | "pasar" | "umum"
 * @returns {Promise<{ jawaban: string, modelAI: string, tokenUsed: number|null }>}
 * @throws {Error} jika tidak ada API key terpasang, atau panggilan API gagal
 */
export async function tanyaAiKonsultan(pertanyaan, topik = "umum") {
  const provider = resolveProvider();

  if (!provider) {
    throw new Error(
      "Belum ada API key LLM terpasang. Isi GEMINI_API_KEY atau OPENAI_API_KEY di .env, lalu restart server."
    );
  }

  if (provider === "gemini") return callGemini(pertanyaan, topik);
  return callOpenAI(pertanyaan, topik);
}
