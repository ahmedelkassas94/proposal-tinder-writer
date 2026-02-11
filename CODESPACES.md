# Run the app in GitHub Codespaces

Your repo is set up for [GitHub Codespaces](https://github.com/features/codespaces). You’ll get an HTTPS URL so the app loads even if your company blocks localhost.

## 1. Create a Codespace

1. Open: **https://github.com/ahmedelkassas94/proposal-tinder-writer**
2. Click the green **Code** button.
3. Open the **Codespaces** tab.
4. Click **Create codespace on main** and wait until the environment opens in the browser.

## 2. Add your OpenAI API key (once)

1. In GitHub: repo **Settings** → **Secrets and variables** → **Codespaces**.
2. Click **New repository secret**.
3. Name: `OPENAI_API_KEY`  
   Value: your real OpenAI API key.
4. Save.

Codespaces will expose this as an environment variable; the app will use it automatically.

## 3. Run the app in the Codespace

In the Codespace terminal (bottom panel), run:

```bash
cp .env.example .env
npx prisma migrate deploy
npm run dev
```

When the dev server is ready, a popup will say **“Your application running on port 3000 is available”** – click **Open in Browser** (or use the “Ports” tab and open port 3000). That HTTPS link will work from your company computer.

## 4. Next time

Open the same Codespace from the repo’s **Code** → **Codespaces** tab, then in the terminal run:

```bash
npm run dev
```

and open the forwarded port 3000 in the browser.
