import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const evento = await this.eventoService.findOneApi(createInscripcionDto.evento);
    const inscripcionPreparado = this.inscripcionRepository.create({
      fechaInscripcion: new Date,
      evento: evento,
      usuario: user,
    })
    const carraresEvento = evento.carreras.map((carrera) => carrera.nombre)
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

  findAll() {
    return `This action returns all inscripcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inscripcion`;
  }

  update(id: number, updateInscripcionDto: UpdateInscripcionDto) {
    return `This action updates a #${id} inscripcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} inscripcion`;
  }
}
