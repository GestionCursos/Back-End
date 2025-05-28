import { Controller, Get, Param } from '@nestjs/common';
import { EventoService } from './evento.service';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly eventoService: EventoService) { }
  @Get(':id')
  obtenerReporteCurso(@Param('id') id: number) {
    return this.eventoService.reporteCurso(id);
  }
  @Get()
  obtenerEventosDisponibles(){
    return this.eventoService.findAllReportes();
  }
}
