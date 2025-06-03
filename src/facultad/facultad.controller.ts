import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FacultadService } from './facultad.service';
import { CreateFacultadDto } from './dto/create-facultad.dto';
import { Public } from 'src/guard/decorators/public.decorator';

@Controller('carreras')
export class FacultadController {
  constructor(private readonly facultadService: FacultadService) { }
  @Post()
  create(@Body() createFacultadDto: CreateFacultadDto) {
    return this.facultadService.create(createFacultadDto);
  }
  @Get()
  @Public()
  findAll() {
    return this.facultadService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.facultadService.findOne(id);
  }
}
