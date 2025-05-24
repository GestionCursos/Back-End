import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    private readonly usuarioService: UsuarioService,
  ) {}
  async create(createSolicitudDto: CreateSolicitudDto) {
    const usuarioEncontrado = await this.usuarioService.findOne(
      createSolicitudDto.idUser,
    );
    const solicitudPreparada = this.solicitudRepository.create({
      ...createSolicitudDto,
      idUser: usuarioEncontrado,
    });

    const solicitudCreada =
      await this.solicitudRepository.save(solicitudPreparada);
    if (!solicitudCreada)
      throw new NotFoundException('No se pudo crear la solicitud');
    return solicitudCreada;
  }

  async findAllSolicitudGeneral() {
    const resultadoGeneral = await this.solicitudRepository
      .createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.idUser', 'usuario')
      .select([
        'solicitud.idSolicitud',
        'solicitud.apartado',
        'solicitud.tipoCambio',
        'solicitud.otroTipo',
        'solicitud.descripcion',
        'solicitud.justificacion',
        'solicitud.urgencia',
        'solicitud.archivo',
        'solicitud.estado',
        'usuario.uid_firebase',
        'usuario.nombres',
        'usuario.apellidos',
        'usuario.correo',
      ])
      .getMany();

    if (!resultadoGeneral || resultadoGeneral.length === 0) {
      throw new NotFoundException('No se encontró ninguna solicitud');
    }

    return resultadoGeneral;
  }

  async findOne(id: number) {
    const resultadoPorUno = await this.solicitudRepository.findOneBy({
      idSolicitud: id,
    });
    if (!resultadoPorUno) {
      throw new NotFoundException('No se Encontro la Solicitud');
    }
    return resultadoPorUno;
  }
  async actualizarEstado(id: number, updateSolicitudDto: UpdateSolicitudDto) {
    const solicitudEncontrada = await this.solicitudRepository.findOneBy({
      idSolicitud: id,
    });
    if (!solicitudEncontrada) {
      throw new NotFoundException('No se Encontro la Solicitud');
    }
    solicitudEncontrada.estado = updateSolicitudDto.estado;
    await this.solicitudRepository.save(solicitudEncontrada);
    return true;
  }
}
