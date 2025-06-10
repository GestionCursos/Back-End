import { Module } from '@nestjs/common';
import { RegistroAprobacionService } from './registro-aprobacion.service';
import { RegistroAprobacionController } from './registro-aprobacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroAprobacion } from './entities/registro-aprobacion.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { SolicitudModule } from 'src/solicitud/solicitud.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroAprobacion]), UsuarioModule, SolicitudModule],
  controllers: [RegistroAprobacionController],
  providers: [RegistroAprobacionService],
})
export class RegistroAprobacionModule { }
