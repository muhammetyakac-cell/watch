# Apple Watch Tarzı Soru-Cevap Uygulaması (React + Vite)

Küçük ekran için optimize edilmiş bir soru-cevap arayüzü.
Gemini `gemini-2.5-flash` modeliyle çalışır.

## Kurulum

```bash
npm install
# CI/deploy ortamında sadece production paketleri kuruluyorsa:
# npm install --include=dev
cp .env.example .env
# .env içine API key ekle
npm run dev
```

## Not

Kod, API anahtarını şu sırayla okur: `VITE_DEFAULT_API_KEY` -> `DEFAULT_API_KEY` -> `window.DEFAULT_API_KEY`.

`DEFAULT_API_KEY` değişkenini doğrudan kullanacaksan Vite config içinde build-time olarak enjekte edilir (bkz. `vite.config.js`). Yine de en sorunsuz yöntem `VITE_DEFAULT_API_KEY` kullanmaktır.


## Vercel

Bu repo `vercel.json` ile **framework: vite** olarak sabitlendi.
Vercel proje ayarlarında da Framework Preset alanı `Vite` olmalı.
