import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Octokit } from "@octokit/rest";
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    private readonly usuarioService: UsuarioService,
  ) { }
  async create(createSolicitudDto: CreateSolicitudDto, userUid?: string) {
    let usuarioEncontrado: Usuario | undefined = undefined;
    if (userUid !== null && userUid !== undefined) {
      usuarioEncontrado = await this.usuarioService.findOne(userUid);
    } else if (createSolicitudDto.idUser) {
      usuarioEncontrado = await this.usuarioService.findOne(createSolicitudDto.idUser);
    }
    // Si no hay usuario, no incluir idUser en el objeto
    const baseSolicitud: any = { ...createSolicitudDto };
    if (usuarioEncontrado) {
      baseSolicitud.idUser = usuarioEncontrado;
    } else {
      delete baseSolicitud.idUser;
    }
    const solicitudPreparada = this.solicitudRepository.create(baseSolicitud);
    const solicitudCreada = await this.solicitudRepository.save(solicitudPreparada);
    if (!solicitudCreada)
      throw new NotFoundException('No se pudo crear la solicitud');
    return solicitudCreada;
  }

  async findAllSolicitudGeneral() {
    // Traer todas las solicitudes, sin filtrar por estado
    const resultadoGeneral = await this.solicitudRepository
      .createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.idUser', 'usuario')
      .leftJoin('detalle_errores', 'detalle', 'detalle.id_solicitud = solicitud.id_solicitud')
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
        'solicitud.colaboradorGithubBackend',
        'solicitud.colaboradorGithubFrontend',
        'solicitud.ramaBackend',
        'solicitud.ramaFrontend',
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
    console.log('DTO recibido en actualizarEstado:', updateSolicitudDto);
    const solicitudEncontrada = await this.solicitudRepository.findOne({
      where: { idSolicitud: id }, relations: ["idUser"],
    });
    if (!solicitudEncontrada) {
      throw new NotFoundException('No se Encontro la Solicitud');
    }
    solicitudEncontrada.estado = updateSolicitudDto.estado;
    // Actualizar siempre el campo, aunque venga vacío o null
    solicitudEncontrada.otroTipo = updateSolicitudDto.otroTipo;
    // Solo enviar correo si la solicitud tiene usuario asociado
    if (solicitudEncontrada.idUser) {
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
        Te informamos que tu solicitud de ${solicitudEncontrada.otroTipo || solicitudEncontrada.tipoCambio} ha sido ${updateSolicitudDto.estado}.
        \n\nHemos considerado tu solicitud y hemos tomado la decisión de ${updateSolicitudDto.estado} por el motivo de ${updateSolicitudDto.descripcion}.
        \n\nEstaremos pendientes de tus solicitudes. ¡Sigue aportando a nuestra web!`
        })
      })
    }
    await this.solicitudRepository.save(solicitudEncontrada);
    return true;
  }

  /**
   * Cambia el estado a 'Completado' y crea un Pull Request en GitHub
   */
  async marcarComoCompletado(id: number, repo: 'backend' | 'frontend') {
    const solicitud = await this.solicitudRepository.findOneBy({ idSolicitud: id });
    if (!solicitud) throw new NotFoundException('No se encontró la solicitud');
    solicitud.estado = 'Completado';
    await this.solicitudRepository.save(solicitud);
    try {
      // Usar la rama ya existente, no crear una nueva
      const branchName = repo === 'backend' ? solicitud.ramaBackend : solicitud.ramaFrontend;
      if (!branchName) throw new Error('No existe una rama asociada a esta solicitud para el repo seleccionado');
      await this.crearPullRequest(solicitud, branchName, repo);
      return { message: 'Solicitud completada y PR creado', branchName };
    } catch (error) {
      // Si ocurre un error en GitHub, pero la BD ya fue actualizada, devolver un mensaje claro
      return {
        message: 'Solicitud completada en la base de datos, pero ocurrió un error al crear el PR en GitHub.',
        error: error?.message || error,
        status: 'warning',
      };
    }
  }

  /**
   * Cambia el estado a 'Cancelado'
   */
  async marcarComoCancelado(id: number) {
    const solicitud = await this.solicitudRepository.findOneBy({ idSolicitud: id });
    if (!solicitud) throw new NotFoundException('No se encontró la solicitud');
    solicitud.estado = 'Cancelado';
    await this.solicitudRepository.save(solicitud);
    return { message: 'Solicitud cancelada' };
  }

  /**
   * Crea una nueva rama en el repo indicado al pasar a 'Implementando'
   */
  async crearRamaGithub(solicitud: any, repo: 'backend' | 'frontend') {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || 'TU_ORG';
    const repoName = repo === 'backend'
      ? process.env.GITHUB_BACKEND_REPO || 'Back-End'
      : process.env.GITHUB_FRONTEND_REPO || 'Front-End';
    // Obtener la referencia del branch develop
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: repoName,
      ref: 'heads/develop',
    });
    // Prefijo Gitflow estricto
    let prefix = 'feature';
    const tipo = (solicitud.tipoCambio || '').toLowerCase();
    if (tipo.includes('error') || tipo.includes('corrección')) {
      prefix = 'hotfix';
    } // Todo lo demás, incluyendo visual/ux/otro, será feature
    // Crear nombre de rama único
    const cleanTitle = (solicitud.titulo || 'solicitud')
      .toLowerCase()
      .replace(/[^a-z0-9\-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 30);
    const branchName = `${prefix}/solicitud-${solicitud.idSolicitud}-${cleanTitle}-${Date.now()}`;
    await octokit.git.createRef({
      owner,
      repo: repoName,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });
    return branchName;
  }

  /**
   * Crea un Pull Request en el repo indicado
   */
  async crearPullRequest(solicitud: any, branchName: string, repo: 'backend' | 'frontend') {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || 'TU_ORG';
    const repoName = repo === 'backend'
      ? process.env.GITHUB_BACKEND_REPO || 'Back-End'
      : process.env.GITHUB_FRONTEND_REPO || 'Front-End';
    await octokit.pulls.create({
      owner,
      repo: repoName,
      title: `Solicitud ${solicitud.idSolicitud}: ${solicitud.titulo || ''}`,
      head: branchName,
      base: 'develop',
      body: solicitud.descripcion || '',
    });
  }

  /**
   * Asigna un colaborador y crea la rama correspondiente en el repo indicado (backend o frontend)
   */
  async asignarColaborador(id: number, colaboradorGithub: string, repo: 'backend' | 'frontend') {
    const solicitud = await this.solicitudRepository.findOneBy({ idSolicitud: id });
    if (!solicitud) {
      throw new NotFoundException('No se encontró la solicitud');
    }
    // Solo asignar el colaborador, NO crear la rama aquí
    if (repo === 'backend') {
      solicitud.colaboradorGithubBackend = colaboradorGithub;
    } else {
      solicitud.colaboradorGithubFrontend = colaboradorGithub;
    }
    await this.solicitudRepository.save(solicitud);
    return solicitud;
  }

  /**
   * Obtiene los colaboradores de un repositorio de GitHub
   */
  async obtenerColaboradoresGithub(repo: 'backend' | 'frontend') {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || 'TU_ORG';
    const repoName = repo === 'backend'
      ? process.env.GITHUB_BACKEND_REPO || 'Back-End'
      : process.env.GITHUB_FRONTEND_REPO || 'Front-End';
    const { data } = await octokit.repos.listCollaborators({ owner, repo: repoName });
    return data.map(user => ({
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      permissions: user.permissions,
    }));
  }

  /**
   * Inicia la implementación: crea ramas y cambia a 'Implementando'
   * Ahora permite iniciar solo backend, solo frontend, o ambos
   */
  async iniciarImplementacion(id: number) {
    const solicitud = await this.solicitudRepository.findOneBy({ idSolicitud: id });
    if (!solicitud) throw new NotFoundException('No se encontró la solicitud');
    // Debe tener al menos un responsable asignado
    if (!solicitud.colaboradorGithubBackend && !solicitud.colaboradorGithubFrontend) {
      throw new Error('Debes asignar al menos un responsable (backend o frontend) antes de iniciar la implementación');
    }
    // Crear rama backend si hay responsable
    let branchBackend: string | undefined = undefined;
    if (solicitud.colaboradorGithubBackend) {
      branchBackend = await this.crearRamaGithub(solicitud, 'backend');
      solicitud.ramaBackend = branchBackend;
    }
    // Crear rama frontend si hay responsable
    let branchFrontend: string | undefined = undefined;
    if (solicitud.colaboradorGithubFrontend) {
      branchFrontend = await this.crearRamaGithub(solicitud, 'frontend');
      solicitud.ramaFrontend = branchFrontend;
    }
    solicitud.estado = 'Implementando';
    await this.solicitudRepository.save(solicitud);
    return { message: 'Implementación iniciada', branchBackend, branchFrontend };
  }

  /**
   * Obtiene los commits de una rama específica en GitHub
   */
  async obtenerCommitsDeRama(repo: 'backend' | 'frontend', branch: string) {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || 'TU_ORG';
    const repoName = repo === 'backend'
      ? process.env.GITHUB_BACKEND_REPO || 'Back-End'
      : process.env.GITHUB_FRONTEND_REPO || 'Front-End';
    try {
      // Obtener la referencia de la rama base (develop)
      const { data: baseRef } = await octokit.git.getRef({
        owner,
        repo: repoName,
        ref: 'heads/develop',
      });
      // Listar los commits exclusivos de la rama (no presentes en develop)
      const { data: comparison } = await octokit.repos.compareCommits({
        owner,
        repo: repoName,
        base: 'develop',
        head: branch,
      });
      // Los commits exclusivos están en comparison.commits
      return comparison.commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
        url: commit.html_url,
      }));
    } catch (e) {
      return { error: 'No se pudieron obtener los commits exclusivos de la rama', details: e.message };
    }
  }
}
