## Proposal & Tinder Writer

AI-assisted web app for drafting proposals (and optionally Tinder messages) from a template + call + extra instructions, with section-by-section editing and Word export.

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."
# Optional:
# OPENAI_MODEL="gpt-4.1-mini"
# OPENAI_BASE_URL="https://api.openai.com/v1"
```

3. Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Start the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Usage (high level)

- On `/` create a project by providing:
  - Project name
  - Mode: Proposal / Tinder
  - Template, Call, and Instructions (paste text and/or upload files)
- The app:
  - Parses the template into sections
  - Extracts instructions into structured JSON using AI
- On `/project/[id]`:
  - Use the left tabs to switch between General Instructions and sections
  - Draft in the center editor (autosave)
  - Use the right panel for relevant instructions
  - Use the section AI chat for targeted rewrites
  - Use **Export (.docx)** to generate a Word file in template order

