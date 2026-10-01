import { CVData } from './types';

export interface PDFExportOptions {
  fileName?: string;
  onProgress?: (progress: number) => void;
}

export async function exportCVToPDF(
  elementId: string = 'print-target-container',
  cvData?: CVData
): Promise<boolean> {
  const printRoot = document.getElementById('print-root');
  const targetElement = document.getElementById(elementId);

  if (!targetElement) {
    console.error('Target element not found for PDF export:', elementId);
    return false;
  }

  // Dynamically load html2pdf module on-demand
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  // Save previous styles
  const prevPosition = printRoot?.style.position || '';
  const prevLeft = printRoot?.style.left || '';
  const prevTop = printRoot?.style.top || '';
  const prevZIndex = printRoot?.style.zIndex || '';
  const prevPointerEvents = printRoot?.style.pointerEvents || '';
  const prevOpacity = printRoot?.style.opacity || '';

  try {
    // Bring print container into coordinate space safely behind UI
    if (printRoot) {
      printRoot.style.position = 'fixed';
      printRoot.style.left = '0px';
      printRoot.style.top = '0px';
      printRoot.style.zIndex = '-99999';
      printRoot.style.opacity = '1';
      printRoot.style.pointerEvents = 'none';
      printRoot.style.overflow = 'hidden';
    }

    // Wait a frame for layout to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    const name = cvData?.personal?.name || 'Resume';
    const cleanName = name.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `${cleanName}_CV.pdf`;

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        width: 794,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      enableLinks: true,
    };

    await (html2pdf as any)().set(opt).from(targetElement).save();
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  } finally {
    // Restore previous styles
    if (printRoot) {
      printRoot.style.position = prevPosition || 'fixed';
      printRoot.style.left = prevLeft || '-9999px';
      printRoot.style.top = prevTop || '0px';
      printRoot.style.zIndex = prevZIndex || '-9999';
      printRoot.style.pointerEvents = prevPointerEvents || 'none';
      printRoot.style.opacity = prevOpacity || '';
      printRoot.style.overflow = 'hidden';
    }
  }
}
