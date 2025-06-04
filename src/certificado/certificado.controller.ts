import { Controller, Get, Post, Body, Patch, Param, Delete, Res, NotFoundException } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { Public } from 'src/guard/decorators/public.decorator';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';

@Controller('certificado')
export class CertificadoController {
  constructor(
    private readonly certificadoService: CertificadoService,
    private readonly firebaseService: FirebaseService,
    private readonly pdfService: PdfService,
  ) { }

  @Get()
  async generarCertificados(@Body() createCertificadoDto: CreateCertificadoDto) {
    const certificados: { id_inscripcion: number; url: string }[] = [];
    const data = await this.certificadoService.crearCertificados(createCertificadoDto);
    console.log('Datos para generar PDF:', data);
    if (!data.inscripciones || data.inscripciones.length === 0) {
      throw new NotFoundException('No hay inscripciones aprobadas para este evento');
    }
    for (let i = 0; i < data.inscripciones.length; i++) {
      const da = {
        ...data,
        inscripciones: data.inscripciones[i]
      }
      // Generar PDF en buffer
      const pdfBuffer = await this.pdfService.generatePdf(da);

      // Nombre del archivo en Firebase Storage
      const filename = `certificados/certificado_${da.inscripciones.id_inscripcion}.pdf`; // carpeta + nombre único

      // Subir buffer a Firebase Storage
      const publicUrl = await this.firebaseService.uploadFile(pdfBuffer, filename, 'application/pdf');

      // Retornar la URL pública al cliente
      // Agregar al array de resultado
      certificados.push({
        id_inscripcion: da.inscripciones.id_inscripcion,
        url: publicUrl,
      });
    }
    return this.certificadoService.createMasiveCertife(certificados);
  }

}
