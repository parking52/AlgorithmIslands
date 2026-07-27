import { chromium } from 'playwright';

const edition = process.argv[2] === 'adult' ? 'adult' : 'child';
const bookUrl = process.env.BOOK_URL ?? 'http://127.0.0.1:4173';
const outputPath = process.env.PDF_PATH ?? `dist/the-pirate-archipelalgo-${edition}.pdf`;
const requestedPaper = (process.env.PAPER_FORMAT ?? 'A4').toUpperCase();
const paperFormat = requestedPaper === 'LETTER' ? 'Letter' : 'A4';

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(bookUrl, { waitUntil: 'networkidle' });
  await page.evaluate(selectedEdition => {
    document.documentElement.dataset.printEdition = selectedEdition;
  }, edition);

  await page.emulateMedia({ media: 'print' });

  if (paperFormat === 'Letter') {
    await page.addStyleTag({
      content: `
        @media print {
          @page { size: Letter; margin: 0; }
          .book-sheet {
            width: 215.9mm !important;
            height: 279.4mm !important;
          }
        }
      `,
    });
  }

  const overflowingSheets = await page.locator('.book-sheet:visible').evaluateAll(sheets =>
    sheets
      .map((sheet, index) => ({
        index: index + 1,
        overflowWidth: sheet.scrollWidth - sheet.clientWidth,
        overflowHeight: sheet.scrollHeight - sheet.clientHeight,
      }))
      .filter(result => result.overflowWidth > 1 || result.overflowHeight > 1),
  );

  if (overflowingSheets.length > 0) {
    throw new Error(`Print layout overflow: ${JSON.stringify(overflowingSheets)}`);
  }

  await page.pdf({
    path: outputPath,
    format: paperFormat,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    tagged: true,
    outline: true,
  });

  process.stdout.write(`Created ${outputPath}\n`);
} finally {
  await browser.close();
}
