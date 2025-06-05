// src/registro-aprobacion/registro-aprobacion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { DataSource, Repository } from 'typeorm';
import { RegistroAprobacion } from './entities/registro-aprobacion.entity';
import { SolicitudService } from 'src/solicitud/solicitud.service';
import { CreateRegistroDto } from './dto/create-registro-aprobacion.dto';

@Injectable()
export class RegistroAprobacionService {
  async generarReporte() : Promise<any[]>{
    const query =await this.dataSource.query(`
      SELECT 
        s.id_solicitud,
        s.apartado,
        s.tipo_cambio,
        s.urgencia,
        s.descripcion,
        s.justificacion,
        s.estado AS estado_solicitud,
        ra.estado AS estado_aprobacion,
        ra.justificacion AS justificacion_aprobacion,
        ra."fechaDecision",
        u.nombres || ' ' || u.apellidos AS aprobado_por,
        u.correo AS correo_aprobador
      FROM 
          public."Solicitudes" s
      JOIN 
          public.registro_aprobacion ra ON ra."solicitudIdSolicitud" = s.id_solicitud
      LEFT JOIN 
          public."Usuarios" u ON u.uid_firebase = ra."usuarioUidFirebase"
      WHERE 
          ra.estado IN ('Aprobado', 'Rechazado')
      ORDER BY 
          ra."fechaDecision" DESC;
      `)
      return query;
  }
  constructor(
    @InjectRepository(RegistroAprobacion)
    private readonly  registroRepo: Repository<RegistroAprobacion>,
    private readonly  solicitudService: SolicitudService,
    private readonly  usuarioservice: UsuarioService,
    private readonly dataSource: DataSource,
  ) { }

  async registrarDecision(dto: CreateRegistroDto, uidUsuario: string) {
    const solicitud = await this.solicitudService.findOne(dto.idSolicitud);
    const usuario = await this.usuarioservice.findOne(uidUsuario);

    // Crear registro de aprobación/rechazo
    const registro = this.registroRepo.create({
      solicitud,
      usuario,
      estado: dto.estado,
      justificacion: dto.justificacion,
    });
    await this.registroRepo.save(registro);

    // Actualizar estado en solicitud
    await this.solicitudService.actualizarEstado(solicitud.idSolicitud, { estado: dto.estado, descripcion: dto.justificacion });
    return registro;
  }
}
