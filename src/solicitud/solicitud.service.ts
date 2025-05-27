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
      .leftJoin('detalle_errores', 'detalle', 'detalle.id_solicitud = solicitud.id_solicitud')
      .where('detalle.id_solicitud IS NULL')
      .andWhere('solicitud.estado = :estado', { estado: 'Pendiente' })
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
    fetch(`${process.env.API_URL_CORREO}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: solicitudEncontrada.idUser.correo,
        subject: "Estado Solicitud",
        text: `Hola, ${solicitudEncontrada.idUser.nombres}, 
        este es un correo enviado desde la administración de nuestra web de cursos.
        Te informamos que tu solicitud de ${solicitudEncontrada.tipoCambio} ha sido ${updateSolicitudDto.estado}.
        \n\nHemos considerado tu solicitud y hemos tomado la decisión de ${updateSolicitudDto.estado} por el motivo de ${updateSolicitudDto.descripcion}.
        \n\nEstaremos pendientes de tus solicitudes. ¡Sigue aportando a nuestra web!`
      })
    })
    await this.solicitudRepository.save(solicitudEncontrada);
    return true;
  }
}
