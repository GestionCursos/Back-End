import { Module } from '@nestjs/common';
import { RequisitoInscripcionService } from './requisito_inscripcion.service';
import { RequisitoInscripcionController } from './requisito_inscripcion.controller';

@Module({
  controllers: [RequisitoInscripcionController],
  providers: [RequisitoInscripcionService],
})
export class RequisitoInscripcionModule {}
