import { Controller, Get } from '@nestjs/common';
import { EstadisticasItilService } from './estadisticas-itil.service';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('estadisticas-itil')
export class EstadisticasItilController {
  constructor(private readonly estadisticasItilService: EstadisticasItilService) { }


  @Get()
  @Public()
  obtenerDesarrolladores() {
    return this.estadisticasItilService.obtenerDesarrolladores();
  }
  @Get('cambios-recientes')
  @Public()
  getCambiosRecientes() {
    return this.estadisticasItilService.obtenerCambiosRecientes();
  }

  @Get('estados')
  @Public()
  getEstados() {
    return this.estadisticasItilService.obtenerEstadisticasEstadoCambio();
  }

  @Get('datosEvolucion')
  @Public()
  getEvolucion() {
    return this.estadisticasItilService.obtenerDatosEvolucion();
  }
  @Get('tiposCambio')
  @Public()
  getTipoCambio() {
    return this.estadisticasItilService.obtenerTiposCambios();
  }
}
