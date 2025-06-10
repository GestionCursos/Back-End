import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { SeccionesModule } from 'src/secciones/secciones.module';
import { FacultadModule } from 'src/facultad/facultad.module';
import { OrganizadorModule } from 'src/organizador/organizador.module';
import { ReporteController } from './reporte.controller';
import { RequisitoModule } from 'src/requisito/requisito.module';

@Module({
  imports:[TypeOrmModule.forFeature([Evento]), SeccionesModule, FacultadModule,OrganizadorModule,RequisitoModule],
  controllers: [EventoController,ReporteController],
  providers: [EventoService],
  exports: [EventoService]
})
export class EventoModule {}
