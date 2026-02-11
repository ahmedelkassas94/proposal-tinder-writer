# Office / No-admin setup

This project is designed to run **without administrator rights** and to work around common office restrictions.

---

## What’s already done (no admin needed)

| Need | Solution (already in the project) |
|------|-----------------------------------|
| Node.js / npm | **Portable Node** in `node-runtime/` – no install, no PATH changes |
| Database | **SQLite** in `prisma/dev.db` – no server, no DB admin |
| Dependencies | Use existing `node_modules/` – avoid `npm install` if possible |
| API key | Stored in `.env` in the project – not in system env |

You do **not** need: global Node install, admin rights, or IT approval for the above.

---

## If something is restricted – workarounds

### 1. Port 3000 / 3001 blocked by firewall

- In the project folder, edit **`.env`** and set a port that’s usually allowed (e.g. 8080 or 5000):
  ```env
  PORT=8080
  ```
- Restart the app, then open: **http://127.0.0.1:8080** (or the port you set).

### 2. “localhost” doesn’t work (proxy / DNS)

- Use **127.0.0.1** instead of localhost:
  - **http://127.0.0.1:3000** (or the port from `.env`).

### 3. OpenAI API blocked (no outbound HTTPS to api.openai.com)

- The app still runs: you can create projects, edit sections, and **Export to Word**.
- AI features (instruction extraction, chat, “Improve clarity”, etc.) will fail or be skipped.
- To fully use AI you’d need an exception from IT (e.g. allow `api.openai.com`) or run from a non‑restricted network.

### 4. Cursor Simple Browser restricted or broken

- Open the app in your **normal browser** (Chrome, Edge, etc.):
  - **http://127.0.0.1:3000** (or your `PORT` from `.env`).

### 5. You can’t run arbitrary commands

- Use the **one-click run script** (see below) so you only run a single script from the project folder, no need to type npm/Node paths.

### 6. Antivirus / security scan slows or blocks the app

- Add the **project folder** to the antivirus “exclusions” list (if your policy allows it), so real‑time scan doesn’t slow `node` or lock files.
- If you can’t change antivirus: first load may stay slow; try waiting 2–3 minutes once.

### 7. No internet at all (e.g. locked-down PC)

- Everything runs **offline** except:
  - **OpenAI** (instruction extraction, AI chat, section improvements). Without internet those won’t work; create/edit/export still does.
- You don’t need internet for: creating projects, editing text, exporting .docx, or opening the app.

---

## One script to run the app (no admin)

From the **project folder** in PowerShell (or use “Run script” below):

```powershell
$nodeDir = (Resolve-Path "./node-runtime/node-v20.11.1-win-x64").Path
$env:PATH = "$nodeDir;" + $env:PATH
$env:NODE_ENV = "development"
& "./node-runtime/node-v20.11.1-win-x64/npm.cmd" run dev
```

Then open in the browser: **http://127.0.0.1:3000** (or the port shown in the terminal, or the one you set in `.env`).

---

## When you *do* need the administrator (1h call)

You only need IT/admin if you want:

- **Global Node.js install** (optional; we have portable Node).
- **OpenAI unblocked** (if your network blocks it and you want AI features).
- **Specific port opened** (only if your policy blocks all high ports and you can’t use e.g. 8080).
- **Antivirus exclusions** for the project folder (to reduce slowdowns).

Everything else is designed to work without admin.
