import { Controller, Get, Param } from '@nestjs/common';
import { EventoService } from './evento.service';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly eventoService: EventoService) { }
  @Get('recientes')
  @Public()
  getEventosRecientes() {
    return this.eventoService.obtenerRecientes();
  }
  @Get(':id')
  obtenerReporteCurso(@Param('id') id: number) {
    return this.eventoService.reporteCurso(id);
  }
  @Get()
  obtenerEventosDisponibles(){
    return this.eventoService.findAllReportes();
  }
}
