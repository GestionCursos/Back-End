import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequisitoEventoService } from './requisito_evento.service';
import { CreateRequisitoEventoDto } from './dto/create-requisito_evento.dto';
import { UpdateRequisitoEventoDto } from './dto/update-requisito_evento.dto';

@Controller('requisito-evento')
export class RequisitoEventoController {
  constructor(private readonly requisitoEventoService: RequisitoEventoService) {}

  @Post()
  create(@Body() createRequisitoEventoDto: CreateRequisitoEventoDto) {
    return this.requisitoEventoService.create(createRequisitoEventoDto);
  }

  @Get()
  findAll() {
    return this.requisitoEventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitoEventoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequisitoEventoDto: UpdateRequisitoEventoDto) {
    return this.requisitoEventoService.update(+id, updateRequisitoEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitoEventoService.remove(+id);
  }
}
