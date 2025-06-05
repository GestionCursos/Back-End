import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Autoridade } from 'src/autoridades/entities/autoridade.entity';
import { ContenidoHome } from 'src/contenido_home/entities/contenido_home.entity';
import { Organizador } from 'src/organizador/entities/organizador.entity';
import { Evento } from 'src/evento/entities/evento.entity';
import { Facultad } from 'src/facultad/entities/facultad.entity';
import { Seccione } from 'src/secciones/entities/seccione.entity';
import { Solicitud } from 'src/solicitud/entities/solicitud.entity';
import { DetalleError } from 'src/detalle-error/entities/detalle-error.entity';
import { Requisito } from 'src/requisito/entities/requisito.entity';
import { RequisitoInscripcion } from 'src/requisito_inscripcion/entities/requisito_inscripcion.entity';
import { Asistencia } from 'src/asistencia/entities/asistencia.entity';
import { Nota } from 'src/asistencia/entities/nota.entity';
import { RegistroAprobacion } from 'src/registro-aprobacion/entities/registro-aprobacion.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Usuario,
        ContenidoHome,
        Organizador,
        Evento,
        Seccione,
        Autoridade,
        Facultad,
        Solicitud,
        DetalleError,
        Requisito,
        RequisitoInscripcion,
        Asistencia,
        Nota,
        RegistroAprobacion,
      ],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
    }),
  ],

  exports: [TypeOrmModule],
})
export class DatabaseModule {}
