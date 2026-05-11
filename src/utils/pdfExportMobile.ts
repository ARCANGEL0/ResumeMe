import { exportToPDF as desktopExport } from './pdfExport';

export async function exportToPDF(elementId: string, fileName: string = 'curriculum.pdf'): Promise<void> {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    return desktopExport(elementId, fileName);
  }

  // Mobile approach: convert to image and download
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLElement)) {
    console.error('PDF export: element not found', elementId);
    return;
  }

  try {
    // Use html2canvas approach or create a printable view
    const html2pdf = await import('html2pdf.js');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdfInstance = (html2pdf as any).default ?? html2pdf;
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdfInstance().set(opt).from(element).save();
  } catch (err) {
    console.error('Mobile PDF export failed:', err);
    // Fallback: try desktop method
    return desktopExport(elementId, fileName);
  }
}
