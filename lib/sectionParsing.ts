export function parseTemplateIntoSections(templateRaw: string): { title: string; order: number }[] {
  const lines = templateRaw.split(/\r?\n/);
  const headings: { index: number; title: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    const looksLikeNumbered =
      /^[0-9]+[.)\s]+/.test(line) ||
      /^section\s+[0-9ivx]+\s*[:.)-]/i.test(line);

    const looksLikeAllCaps =
      line.length > 4 && line === line.toUpperCase() && /^[A-Z0-9\s-]+$/.test(line);

    if (looksLikeNumbered || looksLikeAllCaps) {
      headings.push({ index: i, title: line.replace(/^[0-9. )-]+/, "").trim() || line });
    }
  }

  if (!headings.length) {
    return [{ title: "Main Proposal", order: 0 }];
  }

  return headings.map((h, idx) => ({
    title: h.title,
    order: idx
  }));
}

