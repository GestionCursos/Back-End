import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ParseIntPipe } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  create(@Body() createInscripcionDto: CreateInscripcionDto, @Request() req) {
    return this.inscripcionService.create(createInscripcionDto, req.userUid);
  }

  @Get('/inscrito/:id')
  estaInscrito(@Param('id', ParseIntPipe) id_evento: number, @Request() req) {
    return this.inscripcionService.validarInscripcion(req.userUid, id_evento);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionService.findOne(+id);
  }
  @Patch('aprobar/:id')
  actualizarEstado(@Param('id',ParseIntPipe) id:number,@Body() updateInscripcionDto:UpdateInscripcionDto){
    return this.inscripcionService.actualizar(id,updateInscripcionDto);
  }
}
