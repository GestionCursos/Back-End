import { Injectable } from '@nestjs/common';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificado } from './entities/certificado.entity';
import { Repository } from 'typeorm';
import { InscripcionService } from 'src/inscripcion/inscripcion.service';
import { EventoService } from 'src/evento/evento.service';

@Injectable()
export class CertificadoService {
  async createMasiveCertife(idEvento:number,certificados: { id_inscripcion: number; url: string; }[]) {
    const certificadosAInsertar: Certificado[] = [];

    for (const cert of certificados) {
      const inscripcion = await this.inscripcionService.findOne(cert.id_inscripcion);
      if (!inscripcion) {
        throw new Error("Error uinesperado")
      }

      const nuevoCertificado = this.certificadoRepository.create({
        idInscripcion: inscripcion,
        urlCertificado: cert.url,
      });

      certificadosAInsertar.push(nuevoCertificado);
    }
    await this.eventoService.update(idEvento)

    return await this.certificadoRepository.save(certificadosAInsertar);
  }

  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepository: Repository<Certificado>,
    private readonly inscripcionService: InscripcionService,
    private readonly eventoService: EventoService,
  ) { }

  async crearCertificados(createCertificadoDto: CreateCertificadoDto) {
    const evento = await this.eventoService.findOneResumen(createCertificadoDto.idEvento);
    const inscripciones = await this.inscripcionService.obtenerInscripcionesPorIdEvento(evento.id)
    return {
      evento,
      inscripciones
    }

  }
}
