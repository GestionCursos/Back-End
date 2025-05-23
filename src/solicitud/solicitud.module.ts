import { Module } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './entities/solicitud.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  controllers: [SolicitudController],
  providers: [SolicitudService],
  imports:[TypeOrmModule.forFeature([Solicitud]),UsuarioModule]

})
export class SolicitudModule {}
