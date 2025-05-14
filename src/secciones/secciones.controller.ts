import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeccionesService } from './secciones.service';
import { CreateSeccioneDto } from './dto/create-seccione.dto';
import { UpdateSeccioneDto } from './dto/update-seccione.dto';

@Controller('secciones')
export class SeccionesController {
  constructor(private readonly seccionesService: SeccionesService) {}

  @Post()
  create(@Body() createSeccioneDto: CreateSeccioneDto) {
    return this.seccionesService.create(createSeccioneDto);
  }

  @Get()
  findAll() {
    return this.seccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeccioneDto: UpdateSeccioneDto) {
    return this.seccionesService.update(+id, updateSeccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seccionesService.remove(+id);
  }
}
