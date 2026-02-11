# Run the app on a company PC (localhost blocked)

On your company computer, **do not** use `START_APP_AND_OPEN.bat` or open `http://localhost:3000`. Corporate security blocks localhost, so the app will never load.

Use **GitHub Codespaces** instead. You get an **HTTPS** link that works from your company network.

---

## Steps (every time you want to use the app)

1. **Open the repo in the browser**  
   https://github.com/ahmedelkassas94/proposal-tinder-writer

2. **Open your Codespace**  
   - Click the green **Code** button  
   - Open the **Codespaces** tab  
   - Click your existing Codespace (or **Create codespace on main** the first time)  
   - Wait until the Codespace loads in the browser (editor + terminal)

3. **Start the app inside the Codespace**  
   In the **terminal** at the bottom, run:
   ```bash
   npm run dev
   ```

4. **Open the app with the HTTPS link (not localhost)**  
   - When you see “Ready” and a popup about port 3000, click **“Open in Browser”**  
   - Or open the **Ports** tab in the bottom panel → find **3000** → click the **globe/link** icon  
   - That opens a URL like `https://xxx-3000.app.github.dev` — **that** is your app. Use this link; it does not use localhost.

5. **Bookmark that HTTPS URL**  
   So next time you can open the Codespace, run `npm run dev`, and go straight to your bookmark.

---

## Summary

| Do | Don’t |
|----|--------|
| Use Codespaces and the **HTTPS** link for port 3000 | Use `START_APP_AND_OPEN.bat` or `localhost` on the company PC |
| Run `npm run dev` inside the Codespace terminal | Try to open http://localhost:3000 in Chrome on the company PC |

The batch file and localhost are for **your own PC** (e.g. at home) where localhost is not blocked.
