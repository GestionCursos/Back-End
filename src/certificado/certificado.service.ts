import { Injectable } from '@nestjs/common';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificado } from './entities/certificado.entity';
import { DataSource, Repository } from 'typeorm';
import { InscripcionService } from 'src/inscripcion/inscripcion.service';
import { EventoService } from 'src/evento/evento.service';

@Injectable()
export class CertificadoService {
  obtenerCertificadosPorIdUsuario(userUid: any) {
    const certificados = this.dataSource.query(`
      select
        c.id_certificado, 
        c.url_certificado,
        e.nombre,
        e.url_foto,
        e.categoria,
        e.numero_horas,
        n.nota 
      from
        certificados c
      inner join "Inscripciones" i on
        c.id_inscripcion = i.id_inscripcion
      inner join "Eventos" e on
        e.id_evento = i.id_evento
      inner join "Usuarios" u on
        i.id_usuario = u.uid_firebase
      left join notas n on
        n.id_inscripcion = i.id_inscripcion
      where u.uid_firebase = $1
      `, [userUid]);
    return certificados;
  }

  async createMasiveCertife(idEvento: number, certificados: { id_inscripcion: number; url: string; }[]) {
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
    private readonly dataSource: DataSource,
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
