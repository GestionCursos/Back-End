import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { DataSource, Repository } from 'typeorm';
import { SeccionesService } from 'src/secciones/secciones.service';
import { FacultadService } from 'src/facultad/facultad.service';
import { OrganizadorService } from 'src/organizador/organizador.service';
import { isEmpty } from 'class-validator';
import { RequisitoService } from 'src/requisito/requisito.service';
import { EventoResumenDTO } from './dto/EventoResumenDTO';

@Injectable()
export class EventoService {
  async reporteOrganizador(id: number) {
    const organizador = await this.dataSource.query(`
      select o.id_organizador as id,o.nombre,o.institucion,o.correo from "Organizador" o where o.id_organizador=$1;
    `, [id])
    const cursos = await this.dataSource.query(
      `
      select
        e.nombre,
        COUNT(*) as inscritos,
        AVG(n.nota) as promedio
      from
        notas n
      inner join "Inscripciones" i on
        n.id_inscripcion = i.id_inscripcion
      inner join "Eventos" e on
        i.id_evento = e.id_evento
      where
        e.id_organizador = $1
      group by
        e.nombre;
      `, [id]
    )
    const data = {
      organizador: {
        ...organizador[0]
      },
      cursos: [...cursos]
    }
    return data;
  }

  async getEventosPopulares() {
    const eventos = await this.eventoRepository
      .createQueryBuilder('evento')
      .innerJoin('Inscripciones', 'inscripcion', 'inscripcion.evento = evento.id_evento')
      .innerJoin('evento.idOrganizador', 'organizador')
      .where('evento.visible = :visible', { visible: true })
      .select([
        'evento.id_evento AS id_evento',
        'evento.nombre AS nombre',
        'organizador.nombre AS organizador',
        'COUNT(inscripcion.evento) AS estudiantes'
      ])
      .groupBy('evento.id_evento,organizador.nombre')
      .orderBy('estudiantes', 'DESC')
      .limit(4)
      .getRawMany();
    return eventos;
  }
  async findAllReportes() {
    const eventos = await this.eventoRepository
      .createQueryBuilder('evento')
      .innerJoin('Inscripciones', 'inscripcion', 'inscripcion.evento = evento.id_evento')
      .where('evento.visible = :visible', { visible: true })
      .select(['evento.id_evento', 'evento.nombre'])
      .groupBy('evento.id_evento')
      .getRawMany();
    return eventos.map(evento => ({
      id_evento: evento.evento_id_evento,
      nombre: evento.evento_nombre
    }));
  }

  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    private readonly seccionesService: SeccionesService,
    private readonly facultadService: FacultadService,
    private readonly organizadorService: OrganizadorService,
    private readonly dataSource: DataSource,
    private readonly requisitoService: RequisitoService
  ) { }
  async create(createEventoDto: CreateEventoDto) {
    let carrera;
    if (createEventoDto.facultades || !isEmpty(createEventoDto.facultades)) {
      carrera = await this.facultadService.findByIds(createEventoDto.facultades);
    }
    let requisito;
    if (createEventoDto.requisitos) {
      requisito = await this.requisitoService.findByIds(createEventoDto.requisitos);
    }
    const secciones = await this.seccionesService.findOne(createEventoDto.idSeccion);
    const organizador = await this.organizadorService.findOne(createEventoDto.idOrganizador);
    const eventoPreparado = this.eventoRepository.create({
      ...createEventoDto,
      idSeccion: secciones,
      carreras: carrera,
      idOrganizador: organizador,
      requisitos: requisito
    });

    return await this.eventoRepository.save(eventoPreparado);
  }

  async findAll() {
    return await this.eventoRepository.find({ where: { visible: true } });
  }

  async findOne(id: number) {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id },
      relations: ['carreras', 'idSeccion', 'idOrganizador'],
    });
    if (!evento) throw new NotFoundException("No se encontro el evento buscado")
    return evento;
  }
  async findOneApi(id: number) {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento: id }, relations: ['carreras']
    });
    if (!evento) throw new NotFoundException("No se encontro el evento buscado")
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    const eventoEncontrado = await this.eventoRepository.findOne({ where: { id_evento: id } });
    if (!eventoEncontrado) {
      throw new NotFoundException(`Evento con id ${id} no encontrado`);
    }

    // Verificar si se desea actualizar las facultades
    if (updateEventoDto.facultades) {
      const facultades = await this.facultadService.findByIds(updateEventoDto.facultades);
      if (!facultades) {
        throw new NotFoundException(`Facultades con ids ${updateEventoDto.facultades} no encontradas`);
      }
      // Asignar las nuevas facultades al evento
      eventoEncontrado.carreras = facultades;
    }

    if (updateEventoDto.idSeccion) {
      const secciones = await this.seccionesService.findOne(updateEventoDto.idSeccion);
      if (!secciones) {
        throw new NotFoundException(`Sección con id ${updateEventoDto.idSeccion} no encontrada`);
      }
      // Asignar la nueva sección al evento
      eventoEncontrado.idSeccion = secciones;
    }

    // Verificar si se desea actualizar el organizador
    if (updateEventoDto.idOrganizador) {
      const organizador = await this.organizadorService.findOne(updateEventoDto.idOrganizador);
      if (!organizador) {
        throw new NotFoundException(`Organizador con id ${updateEventoDto.idOrganizador} no encontrado`);
      }
      // Asignar el nuevo organizador al evento
      eventoEncontrado.idOrganizador = organizador;
    }
    // Actualizar los campos restantes directamente desde el DTO
    Object.assign(eventoEncontrado, updateEventoDto);
    return this.eventoRepository.save(eventoEncontrado);
  }


  remove(id: number) {
    return this.eventoRepository.softDelete(id);
  }

  async obtenerUltimos(): Promise<{ nombre: string; visible: boolean }[]> {
    return await this.eventoRepository.find({
      select: ['nombre', 'visible'],
      order: { id_evento: 'DESC' },
      take: 5,
    });
  }

  async reporteCurso(id: number) {
    const datosGeneralesEvento = await this.findOne(id);

    const response = await this.dataSource.query(`
        select
          u.nombres || ' '||	u.apellidos as Estudiante,
          u.correo,
          n.nota,
          a.porcentaje_asistencia as "asistencia",
          CASE 
            WHEN n.nota >= e.nota_aprovacion THEN 'Aprobado'
            ELSE 'Reprobado'
          END AS estado
        from
          "Inscripciones" i
        inner join "Eventos" e on
          e.id_evento = i.id_evento
        inner join "Usuarios" u on
          u.uid_firebase = i.id_usuario
        inner join notas n on
          n.id_inscripcion = i.id_inscripcion
        inner join asistencias a on
          a.id_inscripcion = i.id_inscripcion 
        where e.id_evento = $1;
      `, [id]);
    const data = {
      nombre_evento: datosGeneralesEvento.nombre,
      instructor: datosGeneralesEvento.idOrganizador.nombre,
      estudiantes: response
    }
    return data;
  }



  async findOneResumen(id: number): Promise<EventoResumenDTO> {
    const evento = await this.eventoRepository
      .createQueryBuilder('evento')
      .leftJoin('evento.idOrganizador', 'organizador')
      .leftJoin('evento.idSeccion', 'seccion')
      .select([
        'evento.id_evento',
        'evento.nombre',
        'evento.tipoEvento',
        'evento.numeroHoras',
        'evento.modalidad',
        'evento.descripcion',
        'organizador.nombre',
        'organizador.institucion',
        'seccion.nombre'
      ])
      .where('evento.id_evento = :id', { id })
      .getOne();

    if (!evento) throw new NotFoundException("No se encontró el evento buscado");

    return {
      id:evento.id_evento,
      nombre: evento.nombre,
      tipoEvento: evento.tipoEvento,
      numeroHoras: evento.numeroHoras,
      modalidad: evento.modalidad,
      descripcion: evento.descripcion,
      organizadorNombre: evento.idOrganizador.nombre,
      organizadorInstitucion: evento.idOrganizador.institucion,
      seccionNombre: evento.idSeccion.nombre,
    };
  }

}

