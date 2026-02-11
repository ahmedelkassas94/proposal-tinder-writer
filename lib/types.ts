export type SectionInstruction = {
  sectionTitle: string;
  specificRequirements: string[];
  specificEvaluationCriteria: string[];
  wordLimits: string[];
  formattingNotes: string[];
  specificKeywords: string[];
  otherNotes: string[];
};

export type ExtractedInstructions = {
  generalInstructions: {
    requirements: string[];
    evaluationCriteria: string[];
    formattingConstraints: string[];
    deadlines: string[];
    recommendedKeywords: string[];
    doNotInclude: string[];
    otherNotes: string[];
  };
  sections: SectionInstruction[];
  rawSnippets: {
    source: "call" | "instructions";
    text: string;
    mappedTo?: string; // section title or "general"
  }[];
};

