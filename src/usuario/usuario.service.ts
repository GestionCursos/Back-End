import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FacultadService } from 'src/facultad/facultad.service';
import { Facultad } from 'src/facultad/entities/facultad.entity';

@Injectable()
export class UsuarioService {
  async getDashboardData(uid: string) {
    // 1. Obtener usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { uid_firebase: uid },
      relations: ['idCarrera'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 3. Obtener eventos inscritos con detalle
    const eventosInscritos = await this.dataSource.query(
      `
    SELECT 
      i.id_inscripcion,
      i.id_evento,
      json_build_object(
        'id_evento', e.id_evento,
        'nombre', e.nombre,
        'tipo_evento', e.tipo_evento,
        'fecha_inicio', e.fecha_inicio,
        'fecha_fin', e.fecha_fin,
        'modalidad', e.modalidad,
        'num_horas', e.numero_horas,
        'costo', e.costo,
        'categoria_area', e.categoria,
        'descripcion', e.descripcion,
        'url_foto', e.url_foto
      ) AS evento,
      i.fecha_inscripcion,
      i.estado_inscripcion,
      o.nombre as organizador,
      n.nota ,
      a.porcentaje_asistencia
    FROM "Inscripciones" i
    INNER JOIN "Eventos" e ON e.id_evento = i.id_evento
    inner join "Organizador" o  on e.id_organizador =o.id_organizador
    inner join notas n  on n.id_inscripcion =i.id_inscripcion
    inner join asistencias a  on a.id_inscripcion = i.id_inscripcion
    WHERE i.id_usuario = $1
    `,
      [uid],
    );

    // 4. Devolver el JSON final
    return {
      user: {
        uid_firebase: usuario.uid_firebase,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        cedula: "151351351351",
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        carrera: usuario.idCarrera?.nombre ?? null,
        estado: usuario.estado,
        url_foto: usuario.url_foto ?? '/placeholder-user.jpg',
      },
      eventosInscritos,
    };
  }

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly carreraService: FacultadService,
    private readonly dataSource: DataSource
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto, Uid: string) {
    let carrera: Facultad | null = null;
    if (createUsuarioDto.carrera) {
      carrera = await this.carreraService.findByNombre(createUsuarioDto.carrera);
    }

    const usuario = this.usuarioRepository.create(createUsuarioDto);
    usuario.uid_firebase = Uid
    if (carrera) {
      usuario.idCarrera = carrera;
    }
    const savedUsuario = await this.usuarioRepository.save(usuario);
    return savedUsuario;
  }

  async findAll() {
    const buscarTodo = await this.usuarioRepository.find();
    if (!buscarTodo) {
      throw new NotFoundException("Error de Conexion");
    }
    return buscarTodo;
  }

  async findOne(id: string) {
    const buscarUno = await this.usuarioRepository.findOne({ where: { uid_firebase: id }, relations: ['idCarrera'] });
    if (!buscarUno) {
      throw new NotFoundException("No se encontro al Usuario");
    }
    return buscarUno;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const upd = await this.usuarioRepository.update({ uid_firebase: id }, updateUsuarioDto);
    if (!upd) {
      throw new Error('Usuario not found');
    }
    return true;
  }

  async remove(id: string) {
    return await this.usuarioRepository.softDelete({ uid_firebase: id });
  }

  async findRol(id: string) {
    const userUid = await this.usuarioRepository.findOneBy({ uid_firebase: id });
    if (!userUid) {
      throw new NotFoundException("Usuario no encontrado");
    }
    return {
      rol: userUid.rol,
      urlUserImg: userUid.url_foto,
      username: userUid.nombres + ' ' + userUid.apellidos,
    };
  }

  async findUsuariosPorEvento(idEvento: number) {
    const result = await this.dataSource.query(
      `
      SELECT jsonb_build_object(
        'nota_aprovacion', e.nota_aprovacion,
        'requiere_asistencia', e.requiere_asistencia,
        'usuarios', jsonb_agg(
          jsonb_build_object(
            'id', i.id_inscripcion,
            'nombre', u.nombres || ' ' || u.apellidos
          )
        )
      ) AS resultado
      FROM "Usuarios" u
      INNER JOIN "Inscripciones" i ON u.uid_firebase = i.id_usuario
      INNER JOIN "Eventos" e ON e.id_evento = i.id_evento
      LEFT JOIN notas n ON n.id_inscripcion = i.id_inscripcion
      WHERE e.id_evento = $1
        AND i.estado_inscripcion = 'Aprobado'
        AND n.nota IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM asistencias a WHERE a.id_inscripcion = i.id_inscripcion AND a.porcentaje_asistencia IS NOT NULL
        )
      GROUP BY e.nota_aprovacion, e.requiere_asistencia;
        `,
      [idEvento]
    );

    if (result.length === 0 || !result[0]?.resultado) {
      return {
        usuarios: [],
        nota_aprovacion: null,
        requiere_asistencia: false
      };
    }
    return result[0].resultado;
  }
}
