# If the app “doesn’t load” – try these in order

**The app uses port 3000** (set in `.env`). Use **http://127.0.0.1:3000** (not 3004).

---

## Step 0 – See something with NO server (do this first)

**Right‑click `OPEN_TEST_PAGE.ps1` → Run with PowerShell**  
(or double‑click `test-page.html` in File Explorer)

- **If you see:** “Proposal Writer – offline test” in the browser  
  → The browser works. The problem is the server or the URL. Go to Step 1.
- **If you see:** nothing, or “can’t open file”  
  → Try opening `test-page.html` by double‑clicking it in File Explorer. If that also fails, try another browser.

---

## Step 1 – Start the app and open the right URL

**Right‑click `RUN_AND_OPEN.ps1` → Run with PowerShell**

This will:
1. Open a **new** PowerShell window and start the app (leave that window open).
2. Wait 30 seconds.
3. Open your browser to **http://127.0.0.1:3000/ok**.

- **If you see:** “OK - Server is responding.”  
  → The app is running. Then open **http://127.0.0.1:3000** and wait 1–2 minutes for the main page.
- **If you see:** blank page or “can’t connect”  
  → In the **other** PowerShell window, check for errors. If it says “Ready” but the browser is still blank, try **http://localhost:3000/ok** or see Step 2.

---

## Step 2 – Minimal server (no Next)

In PowerShell, from the project folder, run:

```powershell
.\node-runtime\node-v20.11.1-win-x64\node.exe simple-server.js
```

Then open: **http://127.0.0.1:3999**

- **If you see:** “Proposal Writer – test”  
  → Your PC can run a local server. Next.js might be blocked or slow; try Step 1 again and wait longer.
- **If you see:** nothing or “refused”  
  → Firewall or corporate policy may be blocking local servers. Try from another network or PC if possible.

---

## Ports

- **3000** – Next.js app (see `.env`).
- **3999** – Simple test server (Step 2).
