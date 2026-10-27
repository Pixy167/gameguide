# Project: Angela

Panduan interaktif Mobile Legends (HTML + CSS + JavaScript) dengan backend Vercel untuk Pixy AI.

## File (semua di folder utama, tanpa subfolder)
- `index.html`, `style.css`
- `app.js`, `bgm-loader.js`, `player.js`, `ai-lobby.js`, `heroes.js`, `hero-select.js`
- `splash.jpg`, `hero.jpg`, `avatar.jpg`, `shot-1.jpg` sampai `shot-4.jpg`
- `api/chat.js` — backend Pixy AI (opsional, satu-satunya subfolder)
- `heroes/` — foto hero (opsional), nama huruf kecil tanpa spasi/simbol, contoh `heroes/layla.webp`
- `heroes.json` — opsional, guide hero siap pakai

## Deploy dari HP
1. GitHub: buat repo baru, Add file, Upload files, pilih SEMUA file di folder utama, Commit.
2. Untuk Pixy AI: Add file, Create new file, nama `api/chat.js`, tempel isi file `api/chat.js`, Commit.
3. Vercel: Add New Project, pilih repo, Deploy.
4. Settings, Environment Variables: `ANTHROPIC_API_KEY` (dan `ANTHROPIC_MODEL` kalau mau, default `claude-haiku-5-5`), lalu Redeploy.

Kalau muncul pesan "File JavaScript gagal dimuat", ada file .js yang belum ter-upload.
Mainkan dalam mode landscape, dan matikan "Desktop site" di Chrome.
