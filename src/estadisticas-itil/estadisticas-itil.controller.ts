import { Controller } from '@nestjs/common';
import { EstadisticasItilService } from './estadisticas-itil.service';

@Controller('estadisticas-itil')
export class EstadisticasItilController {
  constructor(private readonly estadisticasItilService: EstadisticasItilService) {}
}
