import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import fetch from 'node-fetch';
import * as QRCode from 'qrcode';
import { Writable } from 'stream';

@Injectable()
export class PdfService {
  async generatePdf(data: any): Promise<Buffer> {
    const imageUrl = "https://scontent.fuio26-1.fna.fbcdn.net/v/t39.30808-6/311586012_528977262569685_3610733298273233828_n.png?_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=Sz1IyW2rGR4Q7kNvwGotTgc&_nc_oc=AdniyXqEyMTvv2ERxDBUQMtABEommvZ80_fMP75K5MXSM64nUzpXfujjK9sRtHoU-wA&_nc_zt=23&_nc_ht=scontent.fuio26-1.fna&_nc_gid=5xwUOJG3nHbRofi4QwgT8g&oh=00_AfJfS8OW7OyMiVJLN3bVoj74yZxQaVmpytinw_BPeMj85Q&oe=6842619C";
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });

    // Creamos un array para ir guardando los chunks del PDF
    const chunks: Uint8Array[] = [];

    // Crear un writable stream para capturar el output del PDF en memoria
    const stream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });

    doc.pipe(stream);

    // Banner (imagen completa ancho, altura 80px)
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    doc.image(imageBuffer, 0, 0, { width: doc.page.width, height: 80 });

    // Título sobre el banner con sombra
    const title = 'CERTIFICADO DE PARTICIPACIÓN';
    const titleX = doc.page.width / 4;
    const titleY = 90;

    // Sombra (texto negro semitransparente con desplazamiento)
    doc.font('Helvetica-Bold').fontSize(30).fillColor('rgba(0,0,0,0.3)');
    doc.text(title, titleX + 2, titleY + 2, { align: 'center', width: 0, baseline: 'middle', lineBreak: false });

    // Texto principal en blanco sobre el banner
    doc.fillColor('white');
    doc.text(title, titleX, titleY, { align: 'center', width: 0, baseline: 'middle', lineBreak: false });

    // Separador debajo del banner
    doc.moveTo(40, 120).lineTo(doc.page.width - 40, 120).lineWidth(2).strokeColor('#9E1B32').stroke();

    // Sección Datos del Evento - con fondo suave y borde redondeado
    const eventBoxX = 50;
    const eventBoxY = 140;
    const boxWidth = (doc.page.width / 2) - 70;
    const boxHeight = 170;
    doc.roundedRect(eventBoxX, eventBoxY, boxWidth, boxHeight, 8).fillAndStroke('#FAF0F0', '#9E1B32');

    doc.fillColor('#9E1B32').font('Helvetica-Bold').fontSize(16).text('Detalles del Evento', eventBoxX + 15, eventBoxY + 15);

    doc.font('Helvetica').fontSize(12).fillColor('#4D4D4D');
    const evento = data.evento;
    const detallesEvento = [
      ['Nombre', evento.nombre],
      ['Tipo', evento.seccionNombre],
      ['Horas', evento.numeroHoras.toString()],
      ['Modalidad', evento.modalidad],
      ['Organizador', `${evento.organizadorNombre} (${evento.organizadorInstitucion})`],
      ['Fecha', new Date().toLocaleDateString()],
    ];

    let evY = eventBoxY + 45;
    detallesEvento.forEach(([label, val]) => {
      doc.font('Helvetica-Bold').fillColor('#9E1B32').text(label + ':', eventBoxX + 20, evY);
      doc.font('Helvetica').fillColor('#4D4D4D').text(val.toString(), eventBoxX + 110, evY);
      evY += 18;
    });

    // Sección Datos del Participante - con fondo suave y borde redondeado
    const studentBoxX = doc.page.width / 2 + 10;
    const studentBoxY = eventBoxY;
    doc.roundedRect(studentBoxX, studentBoxY, boxWidth, boxHeight, 8).fillAndStroke('#F7F7F7', '#9E1B32');

    doc.fillColor('#9E1B32').font('Helvetica-Bold').fontSize(16).text('Datos del Participante', studentBoxX + 15, studentBoxY + 15);

    doc.font('Helvetica').fontSize(12).fillColor('#4D4D4D');
    const inscripcionData = data.inscripciones;
    const nombreCompletoEstudiante = `${inscripcionData.nombres}  ${inscripcionData.apellidos}`;

    const detallesEstudiante = [
      ['Nombre', nombreCompletoEstudiante],
      ['Nota', inscripcionData.nota.toString()],
    ];

    let stY = studentBoxY + 45;
    detallesEstudiante.forEach(([label, val]) => {
      doc.font('Helvetica-Bold').fillColor('#9E1B32').text(label + ':', studentBoxX + 20, stY);
      doc.font('Helvetica').fillColor('#4D4D4D').text(val, studentBoxX + 110, stY);
      stY += 18;
    });

    // Frase de certificación en caja centrada
    const certText = `Por medio del presente, se certifica que ${nombreCompletoEstudiante} ha participado exitosamente en el evento "${evento.nombre}".`;
    const certBoxWidth = doc.page.width - 100;
    const certBoxHeight = 80;
    const certBoxX = 50;
    const certBoxY = eventBoxY + boxHeight + 30;

    doc.roundedRect(certBoxX, certBoxY, certBoxWidth, certBoxHeight, 10).fillAndStroke('#FFF4F4', '#9E1B32');

    doc.fillColor('#9E1B32').font('Helvetica-Oblique').fontSize(14);
    doc.text(certText, certBoxX + 20, certBoxY + 20, {
      width: certBoxWidth - 40,
      align: 'center',
      lineGap: 6
    });



    // Generar código QR con la URL o texto que desees (por ejemplo, info del certificado o link de validación)
    const qrData = ` https://www.tu-url.com`;
    const qrImageBuffer = await QRCode.toBuffer(qrData, { type: 'png', margin: 1, width: 100 });

    const qrX = 50;
    const qrY = certBoxY + certBoxHeight + 30;
    const qrSize = 100;
    doc.image(qrImageBuffer, qrX, qrY, { width: qrSize, height: qrSize });






    const signatureX = doc.page.width - 240;
    const signatureY = certBoxY + certBoxHeight + 30;

    doc.moveTo(signatureX, signatureY).lineTo(signatureX + 180, signatureY).lineWidth(1).strokeColor('#9E1B32').stroke();

    doc.fillColor('#9E1B32').font('Helvetica-Oblique').fontSize(12)
      .text('Responsable académico', signatureX + 40, signatureY + 10, { align: 'center' });

    doc.font('Helvetica').fontSize(10).fillColor('#999')
      .text(`Ambato, Ecuador - ${new Date().toLocaleDateString()}`, signatureX + 10, signatureY + 30);

    doc.end();

    // Esperar a que el stream termine de escribir
    await new Promise<void>((resolve) => {
      stream.on('finish', () => {
        resolve();
      });
    });

    // Concatenar todos los chunks en un único buffer
    return Buffer.concat(chunks);
  }
}