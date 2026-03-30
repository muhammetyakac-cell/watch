import { useMemo, useState } from "react";

const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const DRAFT_KEY = "watch_qa_draft";

function extractText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text)
      .filter(Boolean)
      .join("\n") || "Cevap alınamadı. Lütfen tekrar dene."
  );
}

function getApiKey() {
  const fromVite = import.meta.env.VITE_DEFAULT_API_KEY || import.meta.env.DEFAULT_API_KEY;
  const fromWindow = typeof window !== "undefined" ? window.DEFAULT_API_KEY : "";
  const fromDefine = typeof __DEFAULT_API_KEY__ !== "undefined" ? __DEFAULT_API_KEY__ : "";

  return fromVite || fromWindow || fromDefine || "";
}

function getInitialDraft() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(DRAFT_KEY) || "";
}

export default function App() {
  const [question, setQuestion] = useState(getInitialDraft);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = useMemo(() => getApiKey(), []);

  const handleQuestionChange = (value) => {
    setQuestion(value);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DRAFT_KEY, value);
    }
  };

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

      <input
        type="text"
        value={question}
        onChange={(event) => handleQuestionChange(event.target.value)}
        placeholder="Sorunu yaz"
        enterKeyHint="done"
        autoCorrect="on"
        autoCapitalize="sentences"
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
