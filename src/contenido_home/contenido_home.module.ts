import { Module } from '@nestjs/common';
import { ContenidoHomeService } from './contenido_home.service';
import { ContenidoHomeController } from './contenido_home.controller';

@Module({
  controllers: [ContenidoHomeController],
  providers: [ContenidoHomeService],
})
export class ContenidoHomeModule {}
