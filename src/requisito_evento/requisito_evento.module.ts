import { Module } from '@nestjs/common';
import { RequisitoEventoService } from './requisito_evento.service';
import { RequisitoEventoController } from './requisito_evento.controller';

@Module({
  controllers: [RequisitoEventoController],
  providers: [RequisitoEventoService],
})
export class RequisitoEventoModule {}
