// Rendu markdown minimaliste (sans dépendance) pour la preview et les PDF.
// Gère : titres, gras, italique, listes (à puces + numérotées), tableaux GFM,
// citations, code (inline + bloc), liens, paragraphes.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function isTableSeparator(line: string): boolean {
  // | --- | :--: | ---: |
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  let inCode = false;

  const closeLists = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Bloc de code ```
    if (line.trim().startsWith("```")) {
      if (inCode) { out.push("</pre>"); inCode = false; }
      else { closeLists(); out.push("<pre>"); inCode = true; }
      continue;
    }
    if (inCode) { out.push(escapeHtml(line)); continue; }

    // Tableau GFM : ligne d'en-tête + ligne séparatrice
    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      closeLists();
      const header = splitRow(line);
      out.push('<table><thead><tr>');
      header.forEach((c) => out.push(`<th>${inline(c)}</th>`));
      out.push("</tr></thead><tbody>");
      i += 2; // saute l'en-tête + séparateur
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        const cells = splitRow(lines[i]);
        out.push("<tr>");
        cells.forEach((c) => out.push(`<td>${inline(c)}</td>`));
        out.push("</tr>");
        i++;
      }
      out.push("</tbody></table>");
      i--; // compense le i++ de la boucle for
      continue;
    }

    // Titres
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeLists();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    // Citation
    const q = line.match(/^\s*>\s?(.*)$/);
    if (q) {
      closeLists();
      out.push(`<blockquote>${inline(q[1])}</blockquote>`);
      continue;
    }

    // Liste numérotée
    if (/^\s*\d+\.\s+/.test(line)) {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (!inOl) { out.push("<ol>"); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      continue;
    }

    // Liste à puces
    if (/^\s*[-*]\s+/.test(line)) {
      if (inOl) { out.push("</ol>"); inOl = false; }
      if (!inUl) { out.push("<ul>"); inUl = true; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      continue;
    }

    if (line.trim() === "") { closeLists(); continue; }

    closeLists();
    out.push(`<p>${inline(line)}</p>`);
  }

  closeLists();
  if (inCode) out.push("</pre>");
  return out.join("\n");
}
