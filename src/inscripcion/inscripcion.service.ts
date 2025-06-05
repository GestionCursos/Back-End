import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { EventoService } from 'src/evento/evento.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly eventoService: EventoService,
    private readonly usuarioService: UsuarioService,

  ) { }
  async create(createInscripcionDto: CreateInscripcionDto, uid_firebase: string) {

    const user = await this.usuarioService.findOne(uid_firebase);
    const evento = await this.eventoService.findOne(createInscripcionDto.evento);
    console.log(evento)
    const inscripcionPreparado = this.inscripcionRepository.create({
      fechaInscripcion: new Date,
      evento: evento,
      usuario: user,
    })
    const carraresEvento = evento.carreras.map((carrera) => carrera.nombre)
    console.log(carraresEvento)
    if (carraresEvento.length !== 0) {
      if (evento.carreras) {
        if (!carraresEvento.includes(user.idCarrera.nombre)) {
          throw new NotFoundException("NO tienes permitido inscribirte en este curso")
        }
      }
    }
    const inscripcionGuardada = await this.inscripcionRepository.save(inscripcionPreparado);
    if (!inscripcionGuardada) throw new NotFoundException("Error de conexion")
    return inscripcionGuardada
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
      .innerJoin('inscripcion.nota', 'nota')
      .innerJoin('inscripcion.usuario', 'usuario')
      .leftJoin('inscripcion.certificado', 'certificado') 
      .where('evento.id_evento=:id', { id })
      .andWhere('inscripcion.estado_inscripcion =:estado', { estado: 'Aprobado' })
      .andWhere('certificado.id_certificado IS NULL') 
      .select(['inscripcion.id_inscripcion', 'nota.nota as nota', 'usuario.nombres as nombres', 'usuario.apellidos as apellidos', 'usuario.uid_firebase as uid_firebase'])
      .getRawMany();
    return inscripcionesDeEvento;
  }
}