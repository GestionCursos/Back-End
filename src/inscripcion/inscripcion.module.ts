import { Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { EventoModule } from 'src/evento/evento.module';
import { RequisitoInscripcionModule } from 'src/requisito_inscripcion/requisito_inscripcion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion]),
    UsuarioModule,
    EventoModule,
    RequisitoInscripcionModule
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports: [InscripcionService],
})
export class InscripcionModule {}