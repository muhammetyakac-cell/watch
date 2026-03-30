import { useMemo, useState } from "react";

const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

function extractText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text)
      .filter(Boolean)
      .join("\n") || "Cevap alınamadı. Lütfen tekrar dene."
  );
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = useMemo(
    () =>
      import.meta.env.VITE_DEFAULT_API_KEY ||
      import.meta.env.DEFAULT_API_KEY ||
      "",
    []
  );

  const askAI = async () => {
    const trimmed = question.trim();

    if (!trimmed) {
      setError("Lütfen bir soru yaz.");
      return;
    }

    if (!apiKey) {
      setError(
        "API anahtarı bulunamadı. VITE_DEFAULT_API_KEY veya DEFAULT_API_KEY tanımla."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: trimmed }]
            }
          ]
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`API hatası (${response.status}): ${details}`);
      }

      const data = await response.json();
      setAnswer(extractText(data));
    } catch (err) {
      setError(err.message || "İstek başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="watch-shell">
      <h1>Soru-Cevap</h1>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Sorunu yaz"
        rows={4}
      />

      <button type="button" onClick={askAI} disabled={loading}>
        {loading ? "Soruluyor..." : "AI'ya Sor"}
      </button>

      {error && <p className="error">{error}</p>}

      <section className="answer-box" aria-live="polite">
        {answer || "Cevap burada görünecek."}
      </section>
    </main>
  );
}
