# Apple Watch Tarzı Soru-Cevap Uygulaması (React + Vite)

Küçük ekran için optimize edilmiş bir soru-cevap arayüzü.
Gemini `gemini-2.5-flash` modeliyle çalışır.

## Kurulum

```bash
npm install
cp .env.example .env
# .env içine API key ekle
npm run dev
```

## Not

Kod, API anahtarını öncelikle `VITE_DEFAULT_API_KEY` ve sonra `DEFAULT_API_KEY` üzerinden okur.
Vite tarafında güvenilir kullanım için `VITE_DEFAULT_API_KEY` önerilir.
