import { Module } from '@nestjs/common';
import { ContenidoHomeService } from './contenido_home.service';
import { ContenidoHomeController } from './contenido_home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContenidoHome } from './entities/contenido_home.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ContenidoHome])],
  controllers: [ContenidoHomeController],
  providers: [ContenidoHomeService],
})
export class ContenidoHomeModule {}
