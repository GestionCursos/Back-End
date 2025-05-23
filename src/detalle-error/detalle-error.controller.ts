import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleErrorService } from './detalle-error.service';
import { CreateDetalleErrorDto } from './dto/create-detalle-error.dto';
import { UpdateDetalleErrorDto } from './dto/update-detalle-error.dto';

@Controller('detalle-error')
export class DetalleErrorController {
  constructor(private readonly detalleErrorService: DetalleErrorService) {}

  @Post()
  create(@Body() createDetalleErrorDto: CreateDetalleErrorDto) {
    return this.detalleErrorService.create(createDetalleErrorDto);
  }

  @Get()
  findAll() {
    return this.detalleErrorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleErrorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleErrorDto: UpdateDetalleErrorDto) {
    return this.detalleErrorService.update(+id, updateDetalleErrorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleErrorService.remove(+id);
  }
}
