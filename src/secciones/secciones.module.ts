import { Module } from '@nestjs/common';
import { SeccionesService } from './secciones.service';
import { SeccionesController } from './secciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seccione } from './entities/seccione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seccione])],
  controllers: [SeccionesController],
  providers: [SeccionesService],
  exports: [SeccionesService],
})
export class SeccionesModule {}
