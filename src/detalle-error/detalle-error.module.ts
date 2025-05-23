import { Module } from '@nestjs/common';
import { DetalleErrorService } from './detalle-error.service';
import { DetalleErrorController } from './detalle-error.controller';

@Module({
  controllers: [DetalleErrorController],
  providers: [DetalleErrorService],
})
export class DetalleErrorModule {}
