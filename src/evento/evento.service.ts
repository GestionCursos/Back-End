import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { Repository } from 'typeorm';
import { SeccionesService } from 'src/secciones/secciones.service';
import { FacultadService } from 'src/facultad/facultad.service';
import { OrganizadorService } from 'src/organizador/organizador.service';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    private readonly seccionesService: SeccionesService,
    private readonly facultadService: FacultadService,
    private readonly organizadorService: OrganizadorService,
  ) { }
  async create(createEventoDto: CreateEventoDto) {
    const carrera = await this.facultadService.findByIds(createEventoDto.facultades);
    const secciones = await this.seccionesService.findOne(createEventoDto.idSeeccion);
    const organizador = await this.organizadorService.findOne(createEventoDto.idOrganizador);
    const eventoPreparado = this.eventoRepository.create({
      ...createEventoDto,
      idSeccion: secciones,
      carreras: carrera,
      idOrganizador: organizador,
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
      where:{id_evento: id},relations:['carreras']
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

    if (updateEventoDto.idSeeccion) {
      const secciones = await this.seccionesService.findOne(updateEventoDto.idSeeccion);
      if (!secciones) {
        throw new NotFoundException(`Sección con id ${updateEventoDto.idSeeccion} no encontrada`);
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
}
