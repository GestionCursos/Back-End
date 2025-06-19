import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) { }

  @Post()
  @Public()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.solicitudService.create(createSolicitudDto);
  }
  @Post('logeado')
  async createSolicitudUserLogeado(@Body() createSolicitudDto: CreateSolicitudDto, @Request() req) {
    try {
      return await this.solicitudService.create(createSolicitudDto, req.userUid);
    } catch (error) {
      console.error('Error al crear solicitud (logeado):', error);
      // Si el error tiene response (ValidationPipe), mostrar el mensaje
      if (error.response) {
        console.error('Detalles del error:', error.response);
      }
      throw error;
    }
  }

  @Get('solicitudesGenerales')
  @Public()
  findAllGeneral() {
    return this.solicitudService.findAllSolicitudGeneral();
  }

  @Get('buscar/:id')
  findOne(@Param('id') id: number) {
    return this.solicitudService.findOne(id);
  }

  @Patch('actualizar/:id')
  update(
    @Param('id') id: number,
    @Body() updateSolicitudDto: UpdateSolicitudDto,
  ) {
    console.log('DTO recibido en PATCH /solicitud/actualizar/:id:', updateSolicitudDto);
    return this.solicitudService.actualizarEstado(id, updateSolicitudDto);
  }

  @Patch('asignar-colaborador/:id')
  @Public()
  asignarColaborador(
    @Param('id') id: number,
    @Body('colaboradorGithub') colaboradorGithub: string,
    @Body('repo') repo: 'backend' | 'frontend',
  ) {
    return this.solicitudService.asignarColaborador(id, colaboradorGithub, repo);
  }

  @Patch('completar/:id')
  marcarComoCompletado(
    @Param('id') id: number,
    @Body('repo') repo: 'backend' | 'frontend',
  ) {
    return this.solicitudService.marcarComoCompletado(id, repo);
  }

  @Patch('cancelar/:id')
  @Public()
  marcarComoCancelado(@Param('id') id: number) {
    return this.solicitudService.marcarComoCancelado(id);
  }

  @Patch('iniciar-implementacion/:id')
  iniciarImplementacion(@Param('id') id: number) {
    return this.solicitudService.iniciarImplementacion(id);
  }

  @Get('colaboradores/:repo')
  @Public()
  getColaboradores(@Param('repo') repo: 'backend' | 'frontend') {
    return this.solicitudService.obtenerColaboradoresGithub(repo);
  }
}
