import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContenidoHomeService } from './contenido_home.service';
import { CreateContenidoHomeDto } from './dto/create-contenido_home.dto';
import { UpdateContenidoHomeDto } from './dto/update-contenido_home.dto';

@Controller('contenido-home')
export class ContenidoHomeController {
  constructor(private readonly contenidoHomeService: ContenidoHomeService) {}

  @Post()
  create(@Body() createContenidoHomeDto: CreateContenidoHomeDto) {
    return this.contenidoHomeService.create(createContenidoHomeDto);
  }

  @Get()
  findAll() {
    return this.contenidoHomeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contenidoHomeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContenidoHomeDto: UpdateContenidoHomeDto) {
    return this.contenidoHomeService.update(+id, updateContenidoHomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contenidoHomeService.remove(+id);
  }
}
