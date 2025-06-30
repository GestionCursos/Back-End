import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import fetch from 'node-fetch';
import * as QRCode from 'qrcode';
import { Writable } from 'stream';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generatePdf(data: any): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });

    const chunks: Uint8Array[] = [];
    const stream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });
    doc.pipe(stream);

    // === Registrar fuentes personalizadas ===
    doc.registerFont('DancingScript-Italic', path.join(process.cwd(), 'src', 'pdf', 'fonts', 'DancingScript-Regular.ttf'));
    doc.registerFont('DMSans-Regular', path.join(process.cwd(), 'src', 'pdf', 'fonts', 'DMSans_18pt-Regular.ttf'));
    doc.registerFont('DMSans-Bold', path.join(process.cwd(), 'src', 'pdf', 'fonts', 'DMSans_18pt-Bold.ttf'));

    // === Fondo del certificado ===
    const certImageUrl = "https://firebasestorage.googleapis.com/v0/b/portafolio-web-1cc28.firebasestorage.app/o/upload%2FCertificado%20de%20Reconocimiento%20Elegante%20Azul%20y%20blanco%20(1).png?alt=media&token=35a2cffb-3b07-4322-bacd-f3a07d0981af";
    const response = await fetch(certImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    doc.image(imageBuffer, 0, 0, { width: doc.page.width, height: doc.page.height });

    // === Nombre (Dancing Script, italic 36px) ===
    doc.font('DancingScript-Italic').fontSize(30).fillColor('black');
    doc.text(
      data.inscripciones.nombres + ' ' + data.inscripciones.apellidos,
      (doc.page.width / 2) - 100,
      275,
      { align: 'center' }
    );

    // === Mensaje multilínea (DM Sans, 16px) ===
    const mensaje = `Por haber completado satisfactoriamente el Evento ${data.evento.nombre} en la modalidad ${data.evento.modalidad}`;
    doc.font('DMSans-Regular').fontSize(16).fillColor('black');

    const maxWidth = 500;
    const lineHeight = 28;
    const x = (doc.page.width / 2) - 130;
    let y = 330;

    const dividirTextoEnLineas = (texto: string, anchoMax: number): string[] => {
      const palabras = texto.split(' ');
      const lineas: string[] = [];
      let linea = '';

      for (const palabra of palabras) {
        const testLinea = linea + palabra + ' ';
        const ancho = doc.widthOfString(testLinea);
        if (ancho > anchoMax) {
          lineas.push(linea.trim());
          linea = palabra + ' ';
        } else {
          linea = testLinea;
        }
      }
      if (linea) lineas.push(linea.trim());
      return lineas;
    };

    const lineas = dividirTextoEnLineas(mensaje, maxWidth);
    for (const linea of lineas) {
      doc.text(linea, x, y, { width: maxWidth, align: 'center' });
      y += lineHeight;
    }

    // === Fecha (DM Sans Bold, 16px, color dorado) ===
    const fechaFormateada = new Date().toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    doc.font('DMSans-Bold').fontSize(16).fillColor('#ebbd25');
    doc.text(fechaFormateada, (doc.page.width / 2), y + 50, {
      width: 300, align: 'center'
    });

// === Código QR y Firma ===
const qrData = `https://edu-events.pages.dev/pages/verificar?id_inscripcion=${data.inscripciones.id_inscripcion}`;
const qrImageBuffer = await QRCode.toBuffer(qrData, { type: 'png', margin: 1, width: 100 });

const qrX = 50;
const qrY = y + 80; // Puedes ajustar según el contenido anterior
const qrSize = 100;
doc.image(qrImageBuffer, qrX, qrY, { width: qrSize, height: qrSize });

const signatureX = doc.page.width - 240;
const signatureY = qrY; // O ajustar según diseño

doc.moveTo(signatureX, signatureY).lineTo(signatureX + 180, signatureY).lineWidth(1).strokeColor('#9E1B32').stroke();

doc.fillColor('#9E1B32').font('Helvetica-Oblique').fontSize(12)
  .text('Responsable académico', signatureX + 40, signatureY + 10, { align: 'center' });

doc.font('Helvetica').fontSize(10).fillColor('#999')
  .text(`Ambato, Ecuador - ${new Date().toLocaleDateString()}`, signatureX + 10, signatureY + 30);


    // === Finalizar PDF ===
    doc.end();
    await new Promise<void>((resolve) => stream.on('finish', resolve));
    return Buffer.concat(chunks);
  }
}
