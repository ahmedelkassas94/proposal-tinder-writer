// Test: Word Document Export
// Run: node tests/test-word-export.js
// Creates: tests/output/test-proposal.docx

const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");
const fs = require("fs");
const path = require("path");

const sections = [
  {
    title: "1. Executive Summary",
    content: `This proposal presents an innovative AI-powered healthcare solution that leverages 
machine learning algorithms to improve patient outcomes. Our consortium brings together 
leading research institutions from across Europe with extensive experience in clinical 
validation and artificial intelligence applications in healthcare.`
  },
  {
    title: "2. Technical Approach",
    content: `Our technical methodology combines state-of-the-art deep learning architectures 
with established clinical workflows. The system architecture employs a modular design 
that ensures scalability and interoperability with existing healthcare IT infrastructure.

Key components include:
- Data ingestion and preprocessing pipeline
- Machine learning model training and validation
- Clinical decision support interface
- Security and privacy compliance layer`
  },
  {
    title: "3. Team and Resources",
    content: `The consortium comprises three EU member states with complementary expertise:
- University of Amsterdam (NL): AI/ML research leadership
- Karolinska Institute (SE): Clinical validation and medical expertise  
- Technical University of Munich (DE): Systems integration and deployment

All partners have successfully completed previous Horizon Europe projects.`
  },
  {
    title: "4. Budget",
    content: `Total requested funding: €4,500,000

Breakdown:
- Personnel costs: €2,700,000 (60%)
- Equipment and infrastructure: €900,000 (20%)
- Travel and dissemination: €450,000 (10%)
- Other direct costs: €450,000 (10%)`
  },
  {
    title: "5. Timeline",
    content: `Project duration: 36 months

Major milestones:
- M6: System architecture finalized
- M12: Prototype development complete
- M18: Clinical validation initiated
- M24: Pilot deployment in 3 hospitals
- M36: Final results and dissemination`
  }
];

async function generateDocx(projectName, sectionData) {
  const children = [];

  // Title
  children.push(
    new Paragraph({
      text: projectName,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 }
    })
  );

  // Sections
  for (const section of sectionData) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    const paragraphs = section.content.split("\n\n");
    for (const para of paragraphs) {
      if (para.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: para.trim() })],
            spacing: { after: 200 }
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }]
  });

  return Packer.toBuffer(doc);
}

async function runTest() {
  console.log("=== Word Export Test ===\n");
  console.log("Generating document with", sections.length, "sections...\n");

  try {
    const buffer = await generateDocx("AI Healthcare Innovation Proposal", sections);
    
    // Create output directory
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save file
    const outputPath = path.join(outputDir, "test-proposal.docx");
    fs.writeFileSync(outputPath, buffer);

    console.log("--- Document Generated ---\n");
    console.log("Saved to:", outputPath);
    console.log("File size:", buffer.length, "bytes");
    console.log("\nOpen the file in Word to verify formatting.");
    console.log("\n=== TEST PASSED ===");
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

runTest();
