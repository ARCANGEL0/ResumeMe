import DOMPurify from 'dompurify';

const A4_WIDTH_MM = '210mm';
const A4_HEIGHT_MM = '297mm';
const EXPORT_ROOT_ATTR = 'data-pdf-export-root';
const A4_HEIGHT_PX = (297 / 25.4) * 96;
const A4_WIDTH_PX = (210 / 25.4) * 96;
const PRINT_FIT_SAFETY = 0.965;

export async function exportToPDF(elementId: string, fileName: string = 'curriculum.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLElement)) {
    console.error('PDF export: element not found', elementId);
    return;
  }

  const safeFileName = sanitizePdfFileName(fileName);
  const printScale = getPrintScale(element);
  const exportMarkup = buildPrintDocument(element, safeFileName, printScale);
  const iframe = document.createElement('iframe');

  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';

  document.body.appendChild(iframe);

  try {
    await loadPrintFrame(iframe, exportMarkup);

    const printWindow = iframe.contentWindow;
    if (!printWindow) {
      throw new Error('PDF export: print frame is not available.');
    }

    const cleanup = () => {
      // 300ms delay to allow print dialog to close before removing iframe
      window.setTimeout(() => {
        iframe.remove();
      }, 300);
    };

    printWindow.addEventListener('afterprint', cleanup, { once: true });
    window.setTimeout(cleanup, 60_000);
  } catch (err) {
    iframe.remove();
    console.error('PDF export failed:', err);
  }
}

function buildPrintDocument(element: HTMLElement, fileName: string, printScale: number): string {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  clone.setAttribute(EXPORT_ROOT_ATTR, 'true');

  if (clone) {
    clone.querySelectorAll('.no-print').forEach((node) => node.remove());
  }

  const baseName = fileName.replace(/\.pdf$/i, '');
  const title = escapeHtml(baseName);
  const styles = collectDocumentStyles();

  return `<!doctype html>
<html lang="${escapeHtml(document.documentElement.lang || 'en')}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${styles}
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      body {
        zoom: ${printScale};
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      [${EXPORT_ROOT_ATTR}="true"] {
        width: ${A4_WIDTH_MM} !important;
        min-height: ${A4_HEIGHT_MM} !important;
        margin: 0 auto !important;
        background: #ffffff !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        filter: none !important;
        overflow: visible !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }

      [${EXPORT_ROOT_ATTR}="true"] *,
      [${EXPORT_ROOT_ATTR}="true"] *::before,
      [${EXPORT_ROOT_ATTR}="true"] *::after {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      [${EXPORT_ROOT_ATTR}="true"] > * {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
    </style>
  </head>
  <body>
    ${DOMPurify.sanitize(clone.outerHTML)}
    <script>
      (async function () {
        try {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        } catch (error) {
          console.error('Print export fonts failed:', error);
        }

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            window.focus();
            window.print();
          });
        });
      }());
    </script>
  </body>
</html>`;
}

function collectDocumentStyles(): string {
  return Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .filter((node) => document.head.contains(node))
    .map((node) => node.outerHTML)
    .join('\n');
}

function loadPrintFrame(iframe: HTMLIFrameElement, markup: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      iframe.removeEventListener('load', handleLoad);
      window.clearTimeout(timeoutId);
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('PDF export: timed out while preparing the print view.'));
    }, 15_000);

    iframe.addEventListener('load', handleLoad, { once: true });
    iframe.srcdoc = markup;
  });
}

function sanitizePdfFileName(fileName: string | null | undefined): string {
  const trimmed = (fileName ?? '').trim() || 'curriculum.pdf';
  const withExtension = trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;

  return withExtension.replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '-');
}

function getPrintScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  if (!width || !height) {
    return 1;
  }

  const widthScale = A4_WIDTH_PX / width;
  const heightScale = A4_HEIGHT_PX / height;
  const scale = Math.min(1, widthScale, heightScale) * PRINT_FIT_SAFETY;

  return Number(Math.max(0.5, Math.min(1, scale)).toFixed(4));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}
