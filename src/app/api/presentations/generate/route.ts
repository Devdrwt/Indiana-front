import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getLivrableById, type Livrable } from "@/lib/livrables";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { livrableId } = await req.json();
  const livrable = getLivrableById(livrableId);

  if (!livrable) {
    return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 });
  }

  const html = renderDeckHtml(livrable);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(html, { waitUntil: "load" });

  const pdf = await page.pdf({
    width: "1920px",
    height: "1080px",
    printBackground: true,
    pageRanges: "1-",
  });

  await browser.close();

  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${livrable.id}.pdf"`,
    },
  });
}

function renderDeckHtml(livrable: Livrable): string {
  // Découpe le markdown en slides (séparateur "## Slide N")
  const slides = livrable.content.split(/^## Slide/m).filter((s) => s.trim());

  const slidesHtml = slides
    .map(
      (slide, i) => `
      <section class="slide">
        <div class="slide-header">
          <span class="brand">DRWINTECH</span>
          <span class="page">${i + 1} / ${slides.length}</span>
        </div>
        <div class="slide-content">
          ${markdownToHtml("## Slide" + slide)}
        </div>
      </section>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>${DRWINTECH_TEMPLATE_CSS}</style></head>
<body>${slidesHtml}</body>
</html>`;
}

const DRWINTECH_TEMPLATE_CSS = `
  body { margin: 0; font-family: Arial, sans-serif; }
  .slide {
    width: 1920px;
    height: 1080px;
    box-sizing: border-box;
    padding: 80px 100px;
    background: #FEFBF3;
    color: #0A1F44;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4px solid #D97706;
    padding-bottom: 20px;
    margin-bottom: 60px;
  }
  .brand { font-weight: 900; letter-spacing: 4px; color: #0A1F44; }
  .page { color: #475569; font-size: 28px; }
  .slide-content h2 { font-size: 72px; color: #0A1F44; margin: 0 0 30px; }
  .slide-content h3 { font-size: 44px; color: #0891B2; }
  .slide-content p { font-size: 32px; line-height: 1.5; }
  .slide-content ul { font-size: 32px; line-height: 1.6; }
  .slide-content strong { color: #D97706; }
`;
