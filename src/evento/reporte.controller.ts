import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EventoService } from './evento.service';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly eventoService: EventoService) { }
  @Get(':id')
  obtenerReporteCurso(@Param('id',ParseIntPipe) id: number) {
    return this.eventoService.reporteCurso(id);
  }
  @Get('organizador/:id')
  obtenerReportePorOrganizador(@Param('id',ParseIntPipe) id: number) {
    return this.eventoService.reporteOrganizador(id);
  }
  @Get()
  obtenerEventosDisponibles(){
    return this.eventoService.findAllReportes();
  }
}
