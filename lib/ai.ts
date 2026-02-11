import { ExtractedInstructions } from "./types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. AI features will be disabled.");
}

export async function chatCompletion(args: {
  systemPrompt: string;
  userMessages: { role: "user" | "assistant" | "system"; content: string }[];
  temperature?: number;
}): Promise<string> {
  const { systemPrompt, userMessages, temperature = 0.2 } = args;

  const messages = [
    { role: "system", content: systemPrompt },
    ...userMessages
  ];

  const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature,
      messages
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as any;
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }
  return content;
}

export async function extractInstructionsWithAI(params: {
  callText: string;
  instructionsText: string;
  sectionTitles: string[];
}): Promise<ExtractedInstructions> {
  const { callText, instructionsText, sectionTitles } = params;

  // Fallback when no API key: allow project creation with empty instructions
  if (!OPENAI_API_KEY) {
    return {
      generalInstructions: {
        requirements: [],
        evaluationCriteria: [],
        formattingConstraints: [],
        deadlines: [],
        recommendedKeywords: [],
        doNotInclude: [],
        otherNotes: []
      },
      sections: sectionTitles.map((title) => ({
        sectionTitle: title,
        specificRequirements: [],
        specificEvaluationCriteria: [],
        wordLimits: [],
        formattingNotes: [],
        specificKeywords: [],
        otherNotes: []
      })),
      rawSnippets: []
    };
  }

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
`.trim();

  const raw = await chatCompletion({
    systemPrompt,
    userMessages: [
      {
        role: "user",
        content:
          userContent +
          `

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
}`
      }
    ]
  });

  try {
    return JSON.parse(raw) as ExtractedInstructions;
  } catch (e) {
    console.error("Failed to parse instructions JSON; returning fallback", e);
    return {
      generalInstructions: {
        requirements: [],
        evaluationCriteria: [],
        formattingConstraints: [],
        deadlines: [],
        recommendedKeywords: [],
        doNotInclude: [],
        otherNotes: []
      },
      sections: [],
      rawSnippets: []
    };
  }
}

export async function rewriteSectionWithAI(params: {
  mode: "PROPOSAL" | "TINDER";
  sectionTitle: string;
  currentDraft: string;
  generalInstructions: ExtractedInstructions["generalInstructions"];
  sectionInstructions: ExtractedInstructions["sections"][number] | undefined;
  templateSectionGuidance?: string;
  otherSectionsSummaries: string[];
  action: string;
  userExtraPrompt?: string;
}): Promise<string> {
  const {
    mode,
    sectionTitle,
    currentDraft,
    generalInstructions,
    sectionInstructions,
    templateSectionGuidance,
    otherSectionsSummaries,
    action,
    userExtraPrompt
  } = params;

  const systemPrompt =
    mode === "PROPOSAL"
      ? "You are an expert grant and proposal writer. You only output section text, no explanations."
      : "You are an expert persuasive dating-profile and message copywriter. You only output section text, no explanations.";

  const userContent = `
You will improve ONLY the section titled "${sectionTitle}".

Current section draft:
"""${currentDraft || "(empty)"}"""

General instructions:
${JSON.stringify(generalInstructions, null, 2)}

Section-specific instructions:
${JSON.stringify(sectionInstructions ?? {}, null, 2)}

Template section guidance (if any):
${templateSectionGuidance || "(none)"}

Short summaries of other sections:
${otherSectionsSummaries.map((s) => `- ${s}`).join("\n") || "(none)"}

Action to perform: ${action}
${userExtraPrompt ? `Additional user prompt: ${userExtraPrompt}` : ""}

IMPORTANT:
- Obey any word limits and formatting constraints mentioned.
- Do NOT include commentary, explanations, or meta-text.
- Return ONLY the revised section text.
`.trim();

  return chatCompletion({
    systemPrompt,
    userMessages: [{ role: "user", content: userContent }],
    temperature: 0.5
  });
}

