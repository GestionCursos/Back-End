import { Controller, Get } from '@nestjs/common';
import { GitService } from './git.service';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) { }

  @Get()
  @Public()
  obtenerDesarrolladores() {
    return this.gitService.obtenerDesarrolladores();
  }
  @Get('cambios-recientes')
  @Public()
  getCambiosRecientes() {
    return this.gitService.obtenerCambiosRecientes();
  }

  @Get('estados')
  @Public()
  getEstados() {
    return this.gitService.obtenerEstadisticasEstadoCambio();
  }

  @Get('datosEvolucion')
  @Public()
  getEvolucion() {
    return this.gitService.obtenerDatosEvolucion();
  }
  @Get('tiposCambio')
  @Public()
  getTipoCambio() {
    return this.gitService.obtenerTiposCambios();
  }
}
