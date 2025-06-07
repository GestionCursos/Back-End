import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Not, Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { EventoService } from 'src/evento/evento.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { RequisitoInscripcionService } from 'src/requisito_inscripcion/requisito_inscripcion.service';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly eventoService: EventoService,
    private readonly usuarioService: UsuarioService,
    private readonly requisitoInscripcionService: RequisitoInscripcionService,

  ) { }

  async create(createInscripcionDto: CreateInscripcionDto, uid_firebase: string) {
    const user = await this.usuarioService.findOne(uid_firebase);
    const evento = await this.eventoService.findOne(createInscripcionDto.evento);

    // Verificación de inscripción existente
    await this.usuarioService.usuarioEstaInscritoEnEvento(user.uid_firebase, evento.id_evento);

    // Verificación de carrera
    const carrerasEvento = evento.carreras.map(c => c.nombre);
    if (carrerasEvento.length > 0 && !carrerasEvento.includes(user.idCarrera.nombre)) {
      throw new NotFoundException("No tienes permitido inscribirte en este curso; no perteneces a la carrera del evento.");
    }

    // Validación de requisitos
    const requisitosMap = {
      1: { field: 'urlCedulaPapeletaV', message: 'Falta el archivo de cédula - papeleta de votación.' },
      2: { field: 'urlComprobantePago', message: 'Falta el archivo de comprobante de pago.' },
      3: { field: 'cartaMotivacion', message: 'Falta el archivo de carta de motivación.' },
    };

    let errores: string[] = [];

    for (const requisito of evento.requisitos) {
      const req = requisitosMap[requisito.idRequisito];
      if (req && !createInscripcionDto[req.field]) {
        errores.push(req.message);
      }
    }

    if (errores.length > 0) {
      throw new NotFoundException(errores.join('\n'));
    }

    // Crear inscripción
    const inscripcion = this.inscripcionRepository.create({
      fechaInscripcion: new Date(),
      evento,
      usuario: user,
    });

    const inscripcionGuardada = await this.inscripcionRepository.save(inscripcion);
    if (!inscripcionGuardada) {
      throw new NotFoundException("Error de conexión");
    }

    // Registrar requisitos
    for (const requisito of evento.requisitos) {
      const req = requisitosMap[requisito.idRequisito];
      if (req) {
        await this.requisitoInscripcionService.create({
          inscripcion: inscripcionGuardada,
          requisito: requisito.idRequisito,
          urlRequisito: createInscripcionDto[req.field],
        });
      }
    }

    return inscripcionGuardada;
  }

 
  async findOne(id: number) {
    const inscripcion = await this.inscripcionRepository.findOneBy({ idInscripcion: id })
    if (!inscripcion) throw new NotFoundException("No existe una inscripcion con el id solicitado")
    return inscripcion;
  }

  async actualizar(id: number, updateInscripcionDto: UpdateInscripcionDto) {
    const inscripcion = await this.findOne(id);
    inscripcion.estadoInscripcion = updateInscripcionDto.estado;
    const actualizado = await this.inscripcionRepository.save(inscripcion);
    if (!actualizado) throw new NotFoundException("Error de coneccion")
    return true
  }

  async obtenerInscripcionesPorIds(ids: number[]) {
    const inscripciones = await this.inscripcionRepository.find({ where: { idInscripcion: In(ids) } });
    if (!inscripciones || inscripciones.length === 0) {
      throw new NotFoundException("No se encontraron inscripciones para generar los certificados");
    }
  }

 
  async obtenerInscripcionesPorIdEvento(id: number) {
    const inscripcionesDeEvento = await this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .innerJoin('inscripcion.evento', 'evento')
      .leftJoin('inscripcion.nota', 'nota') // LEFT JOIN para permitir inscripciones sin nota
      .leftJoin('asistencias', 'asistencia', 'asistencia.id_inscripcion = inscripcion.id_inscripcion') // Join manual a tabla asistencias
      .leftJoin('inscripcion.usuario', 'usuario')
      .leftJoin('inscripcion.certificado', 'certificado')
      .where('evento.id_evento = :id', { id })
      .andWhere('inscripcion.estado_inscripcion = :estado', { estado: 'Aprobado' })
      .andWhere('certificado.id_certificado IS NULL')
      // Filtro condicional para nota
      .andWhere(new Brackets(qb => {
        qb.where('evento.nota_aprovacion IS NULL')
          .orWhere('nota.nota >= evento.nota_aprovacion');
      }))
      // Filtro condicional para asistencia
      .andWhere(new Brackets(qb => {
        qb.where('evento.requiere_asistencia IS NULL')
          .orWhere('asistencia.porcentaje_asistencia >= evento.requiere_asistencia');
      }))
      .select([
        'inscripcion.id_inscripcion AS id_inscripcion',
        'nota.nota AS nota',
        'usuario.nombres AS nombres',
        'usuario.apellidos AS apellidos',
        'usuario.uid_firebase AS uid_firebase'
      ])
      .getRawMany();

    return inscripcionesDeEvento;
  }

}
