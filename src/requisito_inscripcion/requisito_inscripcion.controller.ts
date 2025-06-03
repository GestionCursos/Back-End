import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequisitoInscripcionService } from './requisito_inscripcion.service';
import { CreateRequisitoInscripcionDto } from './dto/create-requisito_inscripcion.dto';
import { UpdateRequisitoInscripcionDto } from './dto/update-requisito_inscripcion.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('requisito-inscripcion')
export class RequisitoInscripcionController {
  constructor(private readonly requisitoInscripcionService: RequisitoInscripcionService) {}

  @Post()
  create(@Body() createRequisitoInscripcionDto: CreateRequisitoInscripcionDto) {
    return this.requisitoInscripcionService.create(createRequisitoInscripcionDto);
  }
  @Get('test-queries')
  @Public()
  async testQueries() {
    return this.requisitoInscripcionService.printQueryResults();
}
}
