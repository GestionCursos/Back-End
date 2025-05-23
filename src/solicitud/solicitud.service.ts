import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { DataSource, Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    private readonly usuarioService: UsuarioService,
    private readonly dataSource: DataSource,
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

  async findAllSolicitudError() {
    const result = await this.dataSource.query(
      `SELECT s.id_solicitud,s.apartado,s.archivo,s.descripcion,s.justificacion,s.urgencia,u.nombres,u.apellidos,de.frecuencia_error from public."Solicitudes" s inner join "Usuarios" u on s.id_user =u.uid_firebase right JOIN public.detalle_errores de ON s.id_solicitud = de.id_solicitud where s.estado = 'Pendiente';`,
    );
    if (!result) {
      throw new NotFoundException('Error de conexion');
    }
    return result;
  }
  async findAllSolicitudGeneral() {
    const resultadoGeneral = await this.dataSource.query(
      `SELECT s.id_solicitud,s.apartado,s.archivo,s.descripcion,s.justificacion,s.urgencia,u.nombres,u.apellidos FROM public."Solicitudes" s inner join "Usuarios" u on s.id_user =u.uid_firebase LEFT JOIN public.detalle_errores de ON s.id_solicitud = de.id_solicitud WHERE de.id_solicitud IS null and s.estado ='Pendiente';`,
    );
    if (!resultadoGeneral) {
      throw new NotFoundException('No se Encontro la Solicitud');
    }
    return resultadoGeneral;
  }

  async findOne(id: number) {
    const resultadoPorUno = await this.dataSource.query(
      `SELECT s.*,de.id_detalle,de.pasos_reproduccion,de.resultado_esperado,de.resultado_observado,de.fecha_insidente,de.frecuencia_error,de.mensaje_error,de.sistema_navegador,de.url_error,de.workaround,u.nombres ,u.apellidos from public."Solicitudes" s inner join "Usuarios" u on s.id_user =u.uid_firebase LEFT JOIN public.detalle_errores de ON s.id_solicitud = de.id_solicitud where s.id_solicitud =${id};`,
    );
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
  }
}
