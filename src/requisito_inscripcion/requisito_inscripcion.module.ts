import { Module } from '@nestjs/common';
import { RequisitoInscripcionService } from './requisito_inscripcion.service';
import { RequisitoInscripcionController } from './requisito_inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequisitoInscripcion } from './entities/requisito_inscripcion.entity';
import { RequisitoModule } from 'src/requisito/requisito.module';
import { InscripcionModule } from 'src/inscripcion/inscripcion.module';

@Module({
  controllers: [RequisitoInscripcionController],
  imports: [TypeOrmModule.forFeature([RequisitoInscripcion]),RequisitoModule,InscripcionModule],
  providers: [RequisitoInscripcionService],
})
export class RequisitoInscripcionModule {}
