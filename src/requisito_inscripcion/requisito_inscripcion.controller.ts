import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequisitoInscripcionService } from './requisito_inscripcion.service';
import { CreateRequisitoInscripcionDto } from './dto/create-requisito_inscripcion.dto';
import { UpdateRequisitoInscripcionDto } from './dto/update-requisito_inscripcion.dto';

@Controller('requisito-inscripcion')
export class RequisitoInscripcionController {
  constructor(private readonly requisitoInscripcionService: RequisitoInscripcionService) {}

  @Post()
  create(@Body() createRequisitoInscripcionDto: CreateRequisitoInscripcionDto) {
    return this.requisitoInscripcionService.create(createRequisitoInscripcionDto);
  }

  @Get()
  findAll() {
    return this.requisitoInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitoInscripcionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequisitoInscripcionDto: UpdateRequisitoInscripcionDto) {
    return this.requisitoInscripcionService.update(+id, updateRequisitoInscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitoInscripcionService.remove(+id);
  }
}
