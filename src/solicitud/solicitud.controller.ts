import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @Post()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.solicitudService.create(createSolicitudDto);
  }

  @Get('solicitudesError')
  findAllError() {
    return this.solicitudService.findAllSolicitudError();
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
