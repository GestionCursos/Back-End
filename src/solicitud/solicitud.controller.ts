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
  createSolicitudUserLogeado(@Body() createSolicitudDto: CreateSolicitudDto, @Request() req) {
    return this.solicitudService.create(createSolicitudDto, req.userUid);
  }

  @Get('solicitudesGenerales')
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
    return this.solicitudService.actualizarEstado(id, updateSolicitudDto);
  }
}
