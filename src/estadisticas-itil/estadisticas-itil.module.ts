import { Module } from '@nestjs/common';
import { EstadisticasItilService } from './estadisticas-itil.service';
import { EstadisticasItilController } from './estadisticas-itil.controller';

@Module({
  controllers: [EstadisticasItilController],
  providers: [EstadisticasItilService],
})
export class EstadisticasItilModule {}
