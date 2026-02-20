// Test: AI Section Rewriting
// Run: node tests/test-ai-rewrite.js
// Requires: OPENAI_API_KEY in .env

require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
  console.error("ERROR: Set your OPENAI_API_KEY in .env file");
  process.exit(1);
}

async function chatCompletion(systemPrompt, userContent, temperature = 0.5) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

async function rewriteSection(params) {
  const {
    sectionTitle,
    currentDraft,
    generalInstructions,
    sectionInstructions,
    action,
    userExtraPrompt
  } = params;

  const systemPrompt = 
    "You are an expert grant and proposal writer. You only output section text, no explanations.";

  const userContent = `
You will improve ONLY the section titled "${sectionTitle}".

Current section draft:
"""${currentDraft || "(empty)"}"""

General instructions:
${JSON.stringify(generalInstructions, null, 2)}

Section-specific instructions:
${JSON.stringify(sectionInstructions || {}, null, 2)}

Action to perform: ${action}
${userExtraPrompt ? `Additional user prompt: ${userExtraPrompt}` : ""}

IMPORTANT:
- Obey any word limits and formatting constraints mentioned.
- Do NOT include commentary, explanations, or meta-text.
- Return ONLY the revised section text.
`.trim();

  return chatCompletion(systemPrompt, userContent);
}

// Test data
const currentDraft = `
Our project will use AI to improve healthcare. We have a good team and 
will work hard to deliver results. The technology is innovative and will
help patients.
`;

const generalInstructions = {
  requirements: ["Maximum 15 pages", "Formal academic tone"],
  evaluationCriteria: ["Excellence 50%", "Impact 30%", "Implementation 20%"],
  recommendedKeywords: ["artificial intelligence", "machine learning", "clinical validation"]
};

const sectionInstructions = {
  sectionTitle: "1. Executive Summary",
  specificRequirements: ["Max 1 page"],
  wordLimits: ["250 words maximum"],
  formattingNotes: ["Clear and concise"]
};

async function runTest() {
  console.log("=== AI Section Rewrite Test ===\n");
  console.log("Original draft:", currentDraft.trim());
  console.log("\nAction: Improve clarity and make more persuasive");
  console.log("\nCalling OpenAI API...\n");

  try {
    const result = await rewriteSection({
      sectionTitle: "1. Executive Summary",
      currentDraft,
      generalInstructions,
      sectionInstructions,
      action: "Improve clarity and coherence. Make it more persuasive and professional.",
      userExtraPrompt: "Include specific keywords: artificial intelligence, clinical validation"
    });

    console.log("--- Rewritten Section ---\n");
    console.log(result);
    console.log("\n=== TEST PASSED ===");
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

runTest();
