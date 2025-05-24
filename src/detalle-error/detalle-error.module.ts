import { Module } from '@nestjs/common';
import { DetalleErrorService } from './detalle-error.service';
import { DetalleErrorController } from './detalle-error.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleError } from './entities/detalle-error.entity';

@Module({
  controllers: [DetalleErrorController],
  providers: [DetalleErrorService],
  imports: [TypeOrmModule.forFeature([DetalleError])]
})
export class DetalleErrorModule {}
