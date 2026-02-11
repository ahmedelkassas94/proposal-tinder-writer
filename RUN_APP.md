# How to run the app

**Office / no-admin?** See **OFFICE_SETUP.md** for restrictions and workarounds.

---

## Easiest: one script (no admin)

1. In the project folder, run **START_APP.ps1** (double‑click or Right‑click → Run with PowerShell).
2. When it says “Ready”, open in the browser: **http://127.0.0.1:3000** (or the port it shows).  
   If your office blocks that port, set `PORT=8080` in `.env` and use **http://127.0.0.1:8080**.

---

## Option A – Dev (good for editing; first load can be slow)

1. Open a terminal in this folder.
2. Run (use your project’s Node if needed):

   ```powershell
   $nodeDir = (Resolve-Path "./node-runtime/node-v20.11.1-win-x64").Path
   $env:PATH = "$nodeDir;" + $env:PATH
   npm run dev
   ```

3. Wait until you see something like: `Local: http://localhost:3000` (or 3001).
4. Open **http://127.0.0.1:3000** in your browser (or Cursor: **Ctrl+Shift+P** → **Simple Browser: Show**).

---

## Option B – Production (faster first load; run after Option A works)

1. Stop the dev server (Ctrl+C in the terminal where it’s running).
2. In the same folder, run:

   ```powershell
   $nodeDir = (Resolve-Path "./node-runtime/node-v20.11.1-win-x64").Path
   $env:PATH = "$nodeDir;" + $env:PATH
   npm run build
   ```

   Wait until the build finishes (can take several minutes).

3. Then run:

   ```powershell
   npm run start
   ```

4. Open **http://localhost:3000** in Simple Browser.

---

## Quick check

- **Server OK?** Open: http://localhost:3000/api/health (or 3001 if dev used that port).  
  You should see: `{"ok":true,"time":"..."}`
