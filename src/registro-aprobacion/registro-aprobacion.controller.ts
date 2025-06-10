// src/registro-aprobacion/registro-aprobacion.controller.ts
import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { RegistroAprobacionService } from './registro-aprobacion.service';
import { CreateRegistroDto } from './dto/create-registro-aprobacion.dto';

@Controller('registro-aprobacion')
export class RegistroAprobacionController {
  constructor(private readonly registroService: RegistroAprobacionService) { }

  @Post()
  async registrar(@Request() req,@Body() createRegistroDto: CreateRegistroDto) {
    return this.registroService.registrarDecision(createRegistroDto,req.userUid);
  }
  @Get()
  async generarReporte() {
    return this.registroService.generarReporte();
  }
}
