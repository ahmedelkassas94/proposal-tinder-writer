// Test: Section Parsing
// Run: node tests/test-section-parsing.js

const template = `
# 1. Executive Summary
Provide a brief overview of the project.

# 2. Technical Approach
Describe your technical methodology and approach.

## 2.1 Architecture
Detail the system architecture.

## 2.2 Implementation Plan
Outline the implementation steps.

# 3. Team and Resources
Describe your team qualifications.

# 4. Budget
Provide cost breakdown.

# 5. Timeline
Include project milestones and deadlines.
`;

function parseTemplateIntoSections(rawTemplate) {
  const lines = rawTemplate.split("\n");
  const sections = [];
  let currentSection = null;
  let order = 0;

  const sectionRegex = /^(#{1,3})\s*(\d+\.?\d*\.?\d*\.?)\s*(.+)$/;

  for (const line of lines) {
    const match = sectionRegex.exec(line.trim());
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      order++;
      currentSection = {
        title: `${match[2]} ${match[3]}`.trim(),
        order,
        content: ""
      };
    } else if (currentSection) {
      currentSection.content += line + "\n";
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    sections.push({
      title: "Main Section",
      order: 1,
      content: rawTemplate
    });
  }

  return sections;
}

// Run test
console.log("=== Section Parsing Test ===\n");
console.log("Input template:\n" + template);
console.log("\n--- Parsed Sections ---\n");

const sections = parseTemplateIntoSections(template);
sections.forEach((s, i) => {
  console.log(`Section ${i + 1}:`);
  console.log(`  Title: "${s.title}"`);
  console.log(`  Order: ${s.order}`);
  console.log(`  Content preview: "${s.content.trim().substring(0, 50)}..."`);
  console.log();
});

console.log(`Total sections found: ${sections.length}`);
