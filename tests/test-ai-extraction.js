// Test: AI Instruction Extraction
// Run: node tests/test-ai-extraction.js
// Requires: OPENAI_API_KEY in .env

require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
  console.error("ERROR: Set your OPENAI_API_KEY in .env file");
  process.exit(1);
}

async function chatCompletion(systemPrompt, userContent) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
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

async function extractInstructions(callText, instructionsText, sectionTitles) {
  const systemPrompt = `
You are an expert proposal analyst. You read "call" texts and instructions and
produce STRICT JSON describing general vs section-specific instructions.

You MUST:
- Respect the provided sectionTitles when assigning section-specific instructions.
- Only assign an instruction to a section if there is explicit naming or strong semantic similarity.
- Anything not clearly tied to a section goes into generalInstructions.
- Respond with ONLY valid JSON matching the schema described by the user, no commentary.
  `.trim();

  const userContent = `
CALL TEXT:
${callText}

OTHER INSTRUCTIONS:
${instructionsText}

SECTION TITLES:
${sectionTitles.map((t) => `- ${t}`).join("\n")}

Return JSON of the form:
{
  "generalInstructions": {
    "requirements": string[],
    "evaluationCriteria": string[],
    "formattingConstraints": string[],
    "deadlines": string[],
    "recommendedKeywords": string[],
    "doNotInclude": string[],
    "otherNotes": string[]
  },
  "sections": [
    {
      "sectionTitle": string,
      "specificRequirements": string[],
      "specificEvaluationCriteria": string[],
      "wordLimits": string[],
      "formattingNotes": string[],
      "specificKeywords": string[],
      "otherNotes": string[]
    }
  ],
  "rawSnippets": [
    {
      "source": "call" | "instructions",
      "text": string,
      "mappedTo"?: string
    }
  ]
}`;

  const raw = await chatCompletion(systemPrompt, userContent);
  return JSON.parse(raw);
}

// Test data
const callText = `
HORIZON EUROPE - CALL FOR PROPOSALS
Topic: AI-Powered Healthcare Solutions

Deadline: March 15, 2026

Evaluation Criteria:
- Excellence (50%): Scientific quality, innovation potential
- Impact (30%): Expected outcomes, dissemination plan
- Implementation (20%): Work plan, consortium, resources

Requirements:
- Maximum 15 pages for main proposal
- Budget up to 5 million EUR
- Consortium of at least 3 EU member states
- TRL 4-6 expected at project end

Keywords to include: artificial intelligence, machine learning, healthcare, patient outcomes, clinical validation
`;

const instructionsText = `
Internal notes:
- Executive Summary should be max 1 page
- Technical Approach must include architecture diagram reference
- Team section should highlight previous EU project experience
- Do NOT mention competitor products by name
- Use formal academic tone throughout
`;

const sectionTitles = [
  "1. Executive Summary",
  "2. Technical Approach",
  "3. Team and Resources",
  "4. Budget",
  "5. Timeline"
];

async function runTest() {
  console.log("=== AI Instruction Extraction Test ===\n");
  console.log("Call text:", callText.substring(0, 100) + "...\n");
  console.log("Instructions:", instructionsText.substring(0, 100) + "...\n");
  console.log("Section titles:", sectionTitles.join(", "));
  console.log("\nCalling OpenAI API...\n");

  try {
    const result = await extractInstructions(callText, instructionsText, sectionTitles);
    console.log("--- Extracted Instructions ---\n");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n=== TEST PASSED ===");
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

runTest();
