import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Octokit } from "@octokit/rest";

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    private readonly usuarioService: UsuarioService,
  ) { }
  async create(createSolicitudDto: CreateSolicitudDto, userUid?: string) {
    const usuarioEncontrado = await this.usuarioService.findOne(
      userUid !== null && userUid !== undefined ? userUid : createSolicitudDto.idUser,
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
    const solicitudEncontrada = await this.solicitudRepository.findOne({
      where: { idSolicitud: id }, relations: ["idUser"],
    });
    if (!solicitudEncontrada) {
      throw new NotFoundException('No se Encontro la Solicitud');
    }
    solicitudEncontrada.estado = updateSolicitudDto.estado;

    // Crear rama en GitHub si la solicitud es aprobada
    if (updateSolicitudDto.estado === 'Aprobado') {
      await this.crearRamaGithub(solicitudEncontrada);
    }

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

  /**
   * Crea una nueva rama en dos repositorios de GitHub (backend y frontend) al aprobar una solicitud
   */
  private async crearRamaGithub(solicitud: any) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || 'TU_ORG';
    const backendRepo = process.env.GITHUB_BACKEND_REPO || 'backend-repo';
    const frontendRepo = process.env.GITHUB_FRONTEND_REPO || 'frontend-repo';
    // Obtener la referencia del branch develop en ambos repos
    const { data: backendRef } = await octokit.git.getRef({
      owner,
      repo: backendRepo,
      ref: 'heads/develop',
    });
    const { data: frontendRef } = await octokit.git.getRef({
      owner,
      repo: frontendRepo,
      ref: 'heads/develop',
    });
    // Crear nombre de rama único con el título de la solicitud (limpio para branch)
    const cleanTitle = (solicitud.titulo || 'solicitud')
      .toLowerCase()
      .replace(/[^a-z0-9\-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 30); // Limita la longitud
    const branchName = `solicitud-${solicitud.idSolicitud}-${cleanTitle}-${Date.now()}`;
    // Crear la nueva rama en backend desde develop
    await octokit.git.createRef({
      owner,
      repo: backendRepo,
      ref: `refs/heads/${branchName}`,
      sha: backendRef.object.sha,
    });
    // Crear la nueva rama en frontend desde develop
    await octokit.git.createRef({
      owner,
      repo: frontendRepo,
      ref: `refs/heads/${branchName}`,
      sha: frontendRef.object.sha,
    });
    return branchName;
  }
}
